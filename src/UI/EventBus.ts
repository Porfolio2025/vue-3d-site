type EventCallback<T = any> = (data: T) => void;

const eventBus = {
    on<T = any>(event: string, callback: EventCallback<T>): void {
        document.addEventListener(event, ((e: Event) => {
            const customEvent = e as CustomEvent<T>;
            callback(customEvent.detail);
        }) as EventListener);
    },

    emit<T = any>(event: string, data: T): void {
        document.dispatchEvent(new CustomEvent<T>(event, { detail: data }));
    },

    off<T = any>(event: string, callback: EventCallback<T>): void {
        document.removeEventListener(event, callback as EventListener);
    },
};

export default eventBus;

