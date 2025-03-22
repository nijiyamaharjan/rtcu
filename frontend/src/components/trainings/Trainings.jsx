import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Grid, List, Search, SlidersHorizontal, Calendar } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "startDate", // "startDate", "endDate", "alphabetical"
    status: "all", // "all", "upcoming", "ongoing", "completed"
    dateRange: "all", // "all", "past", "current", "future"
  });
  
  const user = useAuth();
  
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("http://localhost:5000/training/all");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch trainings`);
        }
        const json = await response.json();
        setTrainings(json);
        setFilteredTrainings(json);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    // Apply search and filters
    let result = [...trainings];
    const today = new Date();
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        training => 
          training.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (training.description && training.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter(training => {
        const startDate = new Date(training.startdate);
        const endDate = new Date(training.enddate);
        
        switch (filters.status) {
          case "upcoming":
            return startDate > today;
          case "ongoing":
            return startDate <= today && endDate >= today;
          case "completed":
            return endDate < today;
          default:
            return true;
        }
      });
    }
    
    // Apply date range filter
    if (filters.dateRange !== "all") {
      result = result.filter(training => {
        const startDate = new Date(training.startdate);
        const endDate = new Date(training.enddate);
        
        switch (filters.dateRange) {
          case "past":
            return endDate < today;
          case "current":
            return startDate <= today && endDate >= today;
          case "future":
            return startDate > today;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case "startDate":
        result.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
        break;
      case "endDate":
        result.sort((a, b) => new Date(a.enddate) - new Date(b.enddate));
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredTrainings(result);
  }, [searchTerm, filters, trainings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (training) => {
    const today = new Date();
    const startDate = new Date(training.startdate);
    const endDate = new Date(training.enddate);
    
    if (startDate > today) {
      return { text: "Upcoming", className: "bg-yellow-100 text-yellow-800" };
    } else if (endDate < today) {
      return { text: "Completed", className: "bg-blue-100 text-blue-800" };
    } else {
      return { text: "Ongoing", className: "bg-green-100 text-green-800" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Trainings</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setFilters({
      sortBy: "startDate",
      status: "all",
      dateRange: "all",
    });
    setSearchTerm("");
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Trainings</h1>
        <div className="flex items-center space-x-2">
          {user && (
            <Link
              to="/add-training"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Training
            </Link>
          )}
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trainings..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* View Toggle and Filter Button */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-md ${viewMode === "grid" ? "bg-white shadow" : ""}`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded-md ${viewMode === "list" ? "bg-white shadow" : ""}`}
                aria-label="List view"
              >
                <List className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <SlidersHorizontal className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter</span>
            </button>
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="startDate">Date</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="past">Past Trainings</option>
                  <option value="current">Current Trainings</option>
                  <option value="future">Future Trainings</option>
                </select>
              </div> */}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear Filters
              </button>
            </div> 
          </div>
        )}
      </div>

      {filteredTrainings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchTerm || filters.status !== "all" || filters.dateRange !== "all"
              ? "No trainings match your search or filters." 
              : "No trainings found. Create your first training to get started."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrainings.map((training) => (
            <div 
              key={training.trainingid}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{training.title}</h2>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(training.startdate)} - {formatDate(training.enddate)}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{training.description}</p>
              
              {training.status && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    training.status === "ongoing" ? "bg-green-100 text-green-800" :
                    training.status === "completed" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {training.status}
                  </span>
                </div>
              )}
              
              <Link
                to={`/training/${training.trainingid}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <ul className="divide-y divide-gray-200">
            {filteredTrainings.map((training) => (
              <li key={training.trainingid} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(training.startdate)} - {formatDate(training.enddate)}</span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 line-clamp-2">{training.description}</p>
                    {training.status && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          training.status === "ongoing" ? "bg-green-100 text-green-800" :
                          training.status === "completed" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {training.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link
                      to={`/training/${training.trainingid}`}
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};