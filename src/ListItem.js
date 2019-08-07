import React from 'react';


const ListItem = (props) => {
    return <li className="list-group-item">
        <button 
            className="btn-sm ml-4 mr-5 btn btn-primary"
            onClick={ props.updateTodo }
        >U</button>
        { props.item.name }
        <button 
            className="btn-sm ml-4 btn btn-danger"
            onClick={ props.deleteTodo }
            >Delete</button>
    </li>;
};


export default ListItem;