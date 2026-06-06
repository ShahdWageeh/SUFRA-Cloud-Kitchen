export default function ProfileFooter() {
    return (
        <div
            className=" sticky bottom-0 bg-white border-t border-surface-low"
        >
            <div
                className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center"
            >
                <span className="text-text-secondary">
                    Last saved today at 10:45 AM
                </span>

                <div className="flex gap-4">
                    <button
                        className="
            px-8 py-3
            border
            border-outline
            rounded-2xl
          "
                    >
                        Discard Changes
                    </button>

                    <button
                        className="
            px-8 py-3
            rounded-2xl
            bg-primary
            text-white
          "
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}