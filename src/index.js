import {createStore} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import {connect,Provider} from 'react-redux'
import {testAddTodo, testToggleTodo} from './tests'
import {todoApp} from './reducers'

//Action creators
const setVisibilityFilter = (filter) => {
	return {
		type:'SET_VISIBILITY_FILTER',
		filter: filter
	};
};

let nextTodoId = 0;
const addTodo = (text) => {
	return {
		type:'ADD_TODO',
		id: nextTodoId++,
		text
	};
};

const toggleTodo = (id) => {
	return {
		type:'TOGGLE_TODO',
		id
	}	
}

//Presentational 
const Link = ({
	active,
	children,
	onClick
}) => {
	console.log('link active: ', active);
	if(active){
		return <span>{children}</span>;
	}
	return (
		<a
			href="#"
			onClick={ (e) => {
				e.preventDefault();
				onClick();
			}}
		>
			{children}
		</a>
	)
};

const mapStateToLinkProps = (state, ownProps) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	}
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter))
		}
	}
}
const FilterLink = connect(
	mapStateToLinkProps,
	mapDispatchToLinkProps
)(Link);

const Filters = () => (
	<p>
		<FilterLink 
			filter='SHOW_ALL'>
			SHOW ALL
		</FilterLink><br/>
		<FilterLink 
			filter='SHOW_COMPLETED'> 
			SHOW COMPLETED
		</FilterLink><br/>
		<FilterLink 
			filter='SHOW_ACTIVE'> 
			SHOW ACTIVE
		</FilterLink><br/>
	</p>

);

//Presentational components
const Todo = ({onClick, completed, text}) => {
	const getTodoStyle = (completed) => {
		let style = {textDecoration:'none'};
		if(completed){
			style.textDecoration = 'line-through';
		}
		return style;
	};
	return(
		<li 
			onClick={onClick}
			style={ getTodoStyle(completed) }
		>
			{text}
		</li>
	);
};

const TodoList = ({todos, onTodoClick}) => (
	<ul>
		{todos.map(todo => 
			<Todo 
				key={todo.id} 
				{...todo}
				onClick={ () => onTodoClick(todo.id) }
			/>
		)}
	</ul>
);

const getVisibleTodos = (todos, filter) => {
	switch(filter){
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter( t => t.completed );
		case 'SHOW_ACTIVE':
			return todos.filter( t => !t.completed );
		default:
			return todos;		
	}
};


const mapStateToTodoListProps = (state) => {
	return { 
		todos: getVisibleTodos(
			state.todos, 
			state.visibilityFilter
		)		
	}
}
const mapDispatchToTodoListProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id))
		}		
	}
}
//CONTAINER COMPONNT -> PRESENTATIONAL COMPONENT
const VisibleTodoList = connect(
	mapStateToTodoListProps,
	mapDispatchToTodoListProps
)(TodoList);


//Functional or Presentation component
let AddTodo = ({dispatch}) => {
	let input;
	return (
		<div>
			<input type="text" ref={node => {
				input = node;
			}} />
			<button onClick={ () => { 
					dispatch(addTodo(input.value))
					input.value = ''; 
				}}>
			 	ADD TASK
	 		</button>
	 	</div>
	);
};
AddTodo = connect()(AddTodo);


const TodoApp = () => (
	<div>
		<AddTodo/>
		<VisibleTodoList/>
		<Filters />
	</div>
)


const runTests = () => {
	testAddTodo();
	testToggleTodo();
};

const renderApp = () => {
	render(
		<Provider store={ createStore(todoApp) }>
			<TodoApp />
		</Provider>,
		document.getElementById('root')
	);
};

renderApp();




