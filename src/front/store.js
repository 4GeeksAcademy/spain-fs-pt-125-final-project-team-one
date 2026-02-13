export const initialStore = () => {
  return {
    message: null,
    api: {
      data: null,
      loading: false,
      error: null,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    case "API_LOADING":
      return {
        ...store,
        api: {
          ...store.api,
          loading: true,
          error: null,
        },
      };

    case "API_SUCCESS":
      return {
        ...store,
        api: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case "API_ERROR":
      return {
        ...store,
        api: {
          ...store.api,
          loading: false,
          error: action.payload,
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
