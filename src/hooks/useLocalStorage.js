import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			// JSON formatına uygun değilse initialValue olarak başlat
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error("LocalStorage parse hatası:", error);
			return initialValue;
		}
	});

	const setValue = (value) => {
		try {
			// value değeri stringe çevriliyor ve localStorage’a kaydediliyor
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error("LocalStorage set hatası:", error);
		}
	};

	return [storedValue, setValue];
}
