import React from 'react';
import '/src/styles/dashboard/widget-container.css';

function WidgetContainer({ children, topic }) {
    return (
        <div className="widget-container-custom">
            {topic && <h2 className="widget-container-topic">{topic}</h2>}
            {children}
        </div>
    );
}

export default WidgetContainer;
