import React from "react";

const Track = ({ title, isrc, iswc, proMlcId, duettiCatalogId }) => {
    return (
        <div className="track-details w-full bg-lime text-green p-4 space-y-1 rounded-xl leading-none">
            <div className="track-title text-2xl maax font-bold leading-none">
                {title}
            </div>
            <div className="text-xs">
                <div className="flex flex-row justify-between">
                    ISRC
                    <div className="track-isrc">{isrc || "—"}</div>
                </div>

                <div className="flex flex-row justify-between">
                    ISWC
                    <div className="track-iswc">{iswc || "—"}</div>
                </div>

                <div className="flex flex-row justify-between">
                    PRO MLC ID
                    <div className="track-pro-mlc-id">{proMlcId || "—"}</div>
                </div>

                <div className="flex flex-row justify-between">
                    Duetti Catalog ID
                    <div className="track-catalog-id">
                        {duettiCatalogId || "—"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Track;
