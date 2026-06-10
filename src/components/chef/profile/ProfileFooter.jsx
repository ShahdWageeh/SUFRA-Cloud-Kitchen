export default function ProfileFooter({ onDiscard, onSave, saving }) {
    return (
        <div
            className=" sticky bottom-0 bg-white border-t border-surface-low"
        >
            <div
                className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center"
            >
                <span className="text-text-secondary">
                    {/* last saved at . . . . . */}
                </span>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onDiscard}
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
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="
            px-8 py-3
            rounded-2xl
            bg-primary
            text-white
            disabled:opacity-50
          "
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}