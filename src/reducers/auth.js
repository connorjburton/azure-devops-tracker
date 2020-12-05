const initialState = {
	todos: [
		{
			id: 0,
			text: 'Learn React',
			completed: true,
		},
	],
	filters: {
		status: 'All',
		colors: [],
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
	default:
		return {
			...state,
		};
	}
};
