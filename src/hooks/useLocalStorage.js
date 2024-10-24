import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window !== "undefined") {
			try {
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			} catch (error) {
				console.error(error);
				return initialValue;
			}
		}
		return initialValue;
	});

	const setValue = (value) => {
		try {
			setStoredValue(value);
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;
