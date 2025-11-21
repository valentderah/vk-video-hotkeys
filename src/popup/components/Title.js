import React from 'react';

const Title = ({title}) => {
    return <div className="table-title" dangerouslySetInnerHTML={{__html: title}}></div>;
};

export default Title;