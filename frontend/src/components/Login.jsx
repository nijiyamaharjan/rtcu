import { useState } from 'react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useSignup } from '../hooks/useSignup';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { login, error, isLoading } = useLogin();
  const { signup, errorSignup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      await signup(email, password);
    } else {
        await login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-[#001f3f] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] to-[#003366]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          </div>
          <div className="relative z-10 text-white p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Welcome to RTCU Portal</h2>
            <p className="text-lg text-blue-100">Secure access to your project and resources.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <button className="text-[#001f3f] hover:text-[#003366] flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{isSignup ? 'Sign up' : 'Sign in'}</h1>
            <p className="text-gray-600 mb-8">{isSignup ? 'Create an account' : 'Access your account'}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              {error && <p className='text-red-500'>{error}</p>}
              {errorSignup && <p className='text-red-500'>{errorSignup}</p>}
              <button
                type="submit"
                className="w-full bg-[#001f3f] text-white py-3 rounded-lg font-medium hover:bg-[#003366] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001f3f]"
              >
                {isSignup ? 'Sign up' : 'Sign in'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-[#001f3f] hover:text-[#003366] font-medium"
              >
                {isSignup ? 'Sign in' : 'Create one now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
