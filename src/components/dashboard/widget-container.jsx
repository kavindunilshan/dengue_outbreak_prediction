import React from 'react';
import '/src/styles/dashboard/widget-container.css';

function WidgetContainer({ children, title }) {
    return (
        <div className="widget-container-custom">
            {title && <h2 className="widget-container-topic"> { title } </h2>}
            {children}
        </div>
    );
}

export default WidgetContainer;
