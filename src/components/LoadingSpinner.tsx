import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
