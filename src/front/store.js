export const initialStore = () => {
  return {
    message: null,
    token: localStorage.getItem("jwt-token") || null, // Cargamos el token si ya existe
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...store,
        token: action.payload, // Guardamos el token en el estado global
      };
      case 'LOGOUT':
      return {
        ...store,
        token: null // Limpiamos el token del estado global
      };

    default:
      throw Error("Unknown action.");
  }
}
