import React from 'react';
import './StudyMaterial.css';

function StudyMaterial() {
  const materials = [
    {
      id: 1,
      title: 'Data Structures',
      topics: [
        {
          id: 1,
          name: 'Arrays and Linked Lists',
          resources: [
            { type: 'PDF', link: '#', title: 'Arrays vs Linked Lists' },
            { type: 'Video', link: '#', title: 'Understanding Linked Lists' }
          ]
        },
        {
          id: 2,
          name: 'Trees and Graphs',
          resources: [
            { type: 'PDF', link: '#', title: 'Tree Traversal Algorithms' },
            { type: 'Practice', link: '#', title: 'Graph Implementation' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Algorithms',
      topics: [
        {
          id: 1,
          name: 'Sorting Algorithms',
          resources: [
            { type: 'PDF', link: '#', title: 'Common Sorting Algorithms' },
            { type: 'Code', link: '#', title: 'Sorting Implementation' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="study-material">
      <h2>Study Materials</h2>
      <div className="materials-container">
        {materials.map((subject) => (
          <div key={subject.id} className="subject-card">
            <h3>{subject.title}</h3>
            {subject.topics.map((topic) => (
              <div key={topic.id} className="topic-section">
                <h4>{topic.name}</h4>
                <div className="resources">
                  {topic.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.link}
                      className={`resource-link ${resource.type.toLowerCase()}`}
                    >
                      <span className="resource-type">{resource.type}</span>
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterial;
