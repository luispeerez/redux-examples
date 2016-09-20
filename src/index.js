import {createStore} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import {testAddTodo, testToggleTodo} from './tests'
import {todoApp} from './reducers'

let nextTodoId = 0;

const FilterLink = ({
	filter, 
	currentFilter,
	onClick, 
	children
}) => {

	if(filter === currentFilter){
		return <span>{children}</span>;
	}

	return (
		<a
			href="#"
			onClick={ () => {
				onClick(filter)
			}}
		>
			{children}
		</a>
	)
};

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
//End presentational components

//Functional component
const AddTodo = ({onAddClick}) => {
	let input;
	return (
		<div>
			<input type="text" ref={node => {
				input = node;
			}} />
			<button onClick={ () => { 
					onAddClick(input.value)
					input.value = ''; 
				}}>
			 	ADD TASK
	 		</button>
	 	</div>
	);
}

const Filters = ({
	visibilityFilter,
	onFilterClick
}) => (
	<p>
		<FilterLink 
			filter='SHOW_ALL' 
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			SHOW ALL
		</FilterLink><br/>
		<FilterLink 
			filter='SHOW_COMPLETED' 
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			SHOW COMPLETED
		</FilterLink><br/>
		<FilterLink 
			filter='SHOW_ACTIVE' 
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			SHOW ACTIVE
		</FilterLink><br/>
	</p>

);
//End functional component


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

class TodoApp extends React.Component{
	render(){
		const {todos, visibilityFilter} = this.props;
		const visibleTodos = getVisibleTodos(
			todos,
			visibilityFilter
		);
		return (
			<div>
				<AddTodo onAddClick={(text) => {
					store.dispatch({
						type:'ADD_TODO',
						id: nextTodoId++,
						text
					})
				}}/>
				<TodoList
						todos={visibleTodos}
						onTodoClick={ id => 
							store.dispatch({
								type:'TOGGLE_TODO',
								id
							}) 
						}
				/>
				<Filters 
					visibilityFilter={visibilityFilter} 
					onFilterClick={ (filter) => {
						store.dispatch({
							type:'SET_VISIBILITY_FILTER',
							filter
						});
					}}
				/>
			</div>
		)
	}
}

const dispatchSampleActions = () => {
	store.dispatch({
		id: 0,
		type: 'ADD_TODO',
		text: 'Primer todo'
	});

	store.dispatch({
		id: 1,
		type: 'ADD_TODO',
		text: 'Segundo todo'
	});

	store.dispatch({
		type:'SET_VISIBILITY_FILTER',
		filter: 'SHOW_COMPLETED'
	});
};

const runTests = () => {
	testAddTodo();
	testToggleTodo();
};

const renderApp = () => {
	console.log('renderApp');
	render(
		<TodoApp 
			{...store.getState()}
		/>,
		document.getElementById('root')
	);
};

const store = createStore(todoApp);
renderApp();
store.subscribe(renderApp);
//dispatchSampleActions();




