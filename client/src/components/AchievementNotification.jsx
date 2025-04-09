import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notification } from 'antd';
import confetti from 'canvas-confetti';
import './AchievementNotification.css';

const rarityColors = {
  common: '#78909C',    // Blue Grey
  rare: '#7E57C2',     // Deep Purple
  epic: '#FF7043',     // Deep Orange
  legendary: '#FFD700'  // Gold
};

const AchievementNotification = ({ achievement }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (achievement) {
      // Show confetti for rare and above achievements
      if (achievement.rarity !== 'common') {
        confetti({
          particleCount: achievement.rarity === 'legendary' ? 150 : 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="achievement-notification"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        style={{
          borderColor: rarityColors[achievement.rarity]
        }}
      >
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-content">
          <h3 className="achievement-title">
            Achievement Unlocked!
          </h3>
          <h4 className="achievement-name" style={{ color: rarityColors[achievement.rarity] }}>
            {achievement.name}
          </h4>
          <p className="achievement-description">{achievement.description}</p>
          <div className="achievement-rarity" style={{ color: rarityColors[achievement.rarity] }}>
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper function to show achievement notification
export const showAchievementNotification = (achievement) => {
  notification.open({
    message: '',
    description: '',
    duration: 5,
    placement: 'bottomRight',
    className: 'achievement-notification-container',
    content: <AchievementNotification achievement={achievement} />
  });
};

export default AchievementNotification;
