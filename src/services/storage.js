import useBookStore from '../store/useBookStore';

export const exportData = () => {
    const state = useBookStore.getState();
    const data = {
        library: state.library,
        wishlist: state.wishlist,
        tags: state.tags,
        exportDate: new Date().toISOString(),
        version: 1
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookshelf-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                // Validate data structure if needed
                if (!Array.isArray(data.library) || !Array.isArray(data.wishlist)) {
                    reject(new Error("Invalid file format"));
                    return;
                }

                useBookStore.getState().importData(data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
