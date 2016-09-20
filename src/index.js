import {createStore} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {testAddTodo, testToggleTodo} from './tests'
import {todoApp} from './reducers'

let nextTodoId = 0;

//Presentational 
const Link = ({
	active,
	children,
	onClick
}) => {
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

//Functional / Container component
class FilterLink extends React.Component{
	componentDidMount(){
		const {store} = this.context;
		this.unsubscribe = store.subscribe( () => 
			this.forceUpdate()
		)
	}
	componentWillUnmount(){
		this.unsubscribe();
	}
	render(){
		const props = this.props;
		const {store} = this.context;
		const state = store.getState();

		return (
			<Link
				active={props.filter === state.visibilityFilter}
				onClick={ () => {
					store.dispatch({
						type:'SET_VISIBILITY_FILTER',
						filter: props.filter
					});
				}}
			>
				{props.children}
			</Link>
		)
	}
}
FilterLink.contextTypes = {
	store: React.PropTypes.object
}; 


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

//Functional / Container component
class VisibleTodoList extends React.Component{
	componentDidMount(){
		const {store} = this.context;
		this.unsubscribe = store.subscribe( () => 
			this.forceUpdate()
		)
	}
	componentWillUnmount(){
		this.unsubscribe();
	}
	render(){
		const props = this.props;
		const {store} = this.context;
		const state = store.getState();

		return (
			<TodoList 
				todos={ getVisibleTodos(
					state.todos, 
					state.visibilityFilter
				)}
				onTodoClick={
					(id) => {
						store.dispatch({
							type:'TOGGLE_TODO',
							id
						})
					}
				}
			/> 
		);
	}
}

//Which context to receive 
VisibleTodoList.contextTypes = {
	store: React.PropTypes.object
}; 

//Functional or Presentation component
const AddTodo = (props, {store}) => {
	let input;
	return (
		<div>
			<input type="text" ref={node => {
				input = node;
			}} />
			<button onClick={ () => { 
					store.dispatch({
						type:'ADD_TODO',
						id: nextTodoId++,
						text: input.value
					});
					input.value = ''; 
				}}>
			 	ADD TASK
	 		</button>
	 	</div>
	);
}

AddTodo.contextTypes = {
	store: React.PropTypes.object
};



const TodoApp = () => (
	<div>
		<AddTodo/>
		<VisibleTodoList/>
		<Filters />
	</div>
)

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


/*
class Provider extends React.Component{
	getChildContext(){
		return {
			store: this.props.store
		};
	}
	render(){
		return this.props.children;
	}
}
Provider.childContextTypes = {
	store: React.PropTypes.object
};
*/

const renderApp = () => {
	render(
		<Provider store={ createStore(todoApp) }>
			<TodoApp />
		</Provider>,
		document.getElementById('root')
	);
};

renderApp();
//dispatchSampleActions();




