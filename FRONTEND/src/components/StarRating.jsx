import { FiStar } from 'react-icons/fi';
import './StarRating.css';

const StarRating = ({ rating = 0, totalRatings, size = 18, showCount = true }) => {
  // Ensure rating is a number and round to 1 decimal place
  const avg = Number(rating || 0).toFixed(1);
  const fullStars = Math.floor(avg);
  const hasHalfStar = avg % 1 >= 0.5;

  return (
    <div className="star-rating-container">
      <div className="stars-group">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= fullStars;
          const isHalf = !isFull && star === fullStars + 1 && hasHalfStar;

          return (
            <div key={star} className="star-wrapper" style={{ width: size, height: size }}>
              {/* Background star */}
              <FiStar size={size} className="star-bg" />
              
              {/* Fill star */}
              {(isFull || isHalf) && (
                <div 
                  className="star-fill-overlay" 
                  style={{ width: isFull ? '100%' : '50%' }}
                >
                  <FiStar size={size} className="star-fill" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showCount && (
        <div className="rating-text">
          <span className="rating-avg">{avg}</span>
          {totalRatings !== undefined && (
            <span className="rating-count">({totalRatings})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
