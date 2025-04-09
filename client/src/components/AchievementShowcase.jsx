import React, { useState, useEffect } from 'react';
import { Card, Progress, Badge, Row, Col, Typography, Space } from 'antd';
import { TrophyOutlined, StarOutlined, RiseOutlined } from '@ant-design/icons';
import api from '../api/config';

const { Title, Text } = Typography;

const AchievementShowcase = () => {
  const [achievementData, setAchievementData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/achievements/summary');
        setAchievementData(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <Card loading={true} />;
  }

  if (!achievementData) {
    return null;
  }

  const { level, xp, nextLevelXP, badges, recentUnlocks } = achievementData;
  const xpProgress = nextLevelXP ? (xp / nextLevelXP) * 100 : 100;

  return (
    <Card title={<Title level={4}><TrophyOutlined /> Achievement Showcase</Title>}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Level and XP Progress */}
        <div>
          <Row align="middle" justify="space-between">
            <Col>
              <Text strong>Level {level}</Text>
            </Col>
            <Col>
              <Text type="secondary">{xp} / {nextLevelXP || '∞'} XP</Text>
            </Col>
          </Row>
          <Progress percent={xpProgress} showInfo={false} />
        </div>

        {/* Recent Badges */}
        <div>
          <Title level={5}><StarOutlined /> Recent Badges</Title>
          <Row gutter={[8, 8]}>
            {badges.slice(0, 4).map((badge, index) => (
              <Col key={index} span={12}>
                <Badge.Ribbon text={badge.category} color="blue">
                  <Card size="small">
                    <Text strong>{badge.name}</Text>
                    <br />
                    <Text type="secondary">{badge.description}</Text>
                    {badge.progress < badge.maxProgress && (
                      <Progress 
                        percent={(badge.progress / badge.maxProgress) * 100} 
                        size="small"
                      />
                    )}
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        </div>

        {/* Recent Achievements */}
        <div>
          <Title level={5}><RiseOutlined /> Recent Unlocks</Title>
          <Row gutter={[8, 8]}>
            {recentUnlocks.map((item, index) => (
              <Col key={index} span={24}>
                <Card size="small">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>{item.name}</Text>
                      <br />
                      <Text type="secondary">
                        {new Date(item.earnedAt || item.unlockedAt).toLocaleDateString()}
                      </Text>
                    </Col>
                    <Col>
                      <Badge 
                        count={item.type || item.category} 
                        style={{ backgroundColor: '#52c41a' }} 
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Space>
    </Card>
  );
};

export default AchievementShowcase;
