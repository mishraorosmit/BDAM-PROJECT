import { Link } from "react-router-dom";

export default function Fallback404() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 h-full min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-bdam-text mb-4">404</h1>
      <p className="text-bdam-muted mb-8 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 min-h-[40px] bg-bdam-surface border border-bdam-border rounded-xl text-bdam-text font-semibold hover:bg-bdam-primary transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return Home
      </Link>
    </div>
  );
}
