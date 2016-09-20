import deepFreeze from 'deep-freeze'
import expect from 'expect'
import {todoApp} from './reducers'


const testAddTodo = () => {
	const stateBefore = [];
	const action = {
		type: 'ADD_TODO',
		id: 0,
		text:'Learn Redux'
	};
	const stateAfter = [
		{
			id:0,
			text:'Learn Redux',
			completed: false
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todoApp(stateBefore, action)
	).toEqual(stateAfter);
};

const testToggleTodo  = () => {
	const stateBefore = [
		{
			id:0,
			text:'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: false
		}
	];

	const action = {
		type: 'TOGGLE_TODO',
		id: 1
	};

	const stateAfter = [
		{
			id:0,
			text:'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(stateAfter);

	expect(
		todoApp(stateBefore, action)
	).toEqual(stateAfter);


}

export {testAddTodo,testToggleTodo}
