// components/pdf/AgreementPDF.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * Props:
 *  - signerName: string (Writer's name)
 *  - signedDate: string (e.g., "August 3, 2025")
 *  - tracks: Array<{
 *      title?: string,
 *      isrc?: string,
 *      iswc?: string,
 *      proId?: string,       // PRO / MLC ID
 *      catalogId?: string    // Duetti Catalog ID
 *    }>
 */

const styles = StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 54,
        paddingHorizontal: 36,
        fontSize: 10,
        lineHeight: 1.35,
    },
    header: { marginBottom: 12 },
    bold: { fontWeight: 700 },
    h1: {
        fontSize: 14,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    h2: {
        fontSize: 12,
        marginTop: 14,
        marginBottom: 6,
        textTransform: "uppercase",
    },
    block: { marginBottom: 8 },
    indent: { marginLeft: 12 },
    listItem: { marginBottom: 3, paddingLeft: 10 },
    divider: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        borderBottomStyle: "solid",
    },
    sigGroup: { marginTop: 16, marginBottom: 10 },
    sigLine: { marginTop: 24, marginBottom: 16 },
    small: { fontSize: 9, color: "#444" },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 9,
        color: "#666",
    },

    // Exhibit table
    table: { marginTop: 8, borderWidth: 1, borderColor: "#bbb" },
    tr: { flexDirection: "row" },
    th: {
        flex: 1,
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#bbb",
        backgroundColor: "#f3f3f3",
        fontSize: 9,
        fontWeight: 700,
    },
    td: {
        flex: 1,
        padding: 6,
        borderRightWidth: 1,
        borderRightColor: "#ddd",
        fontSize: 9,
    },
    lastCell: { borderRightWidth: 0 },
});

const Header = () => (
    <View style={styles.header}>
        <Text style={styles.bold}>DUETTI, Inc.</Text>
        <Text>250 Lafayette St, 2nd Fl, New York, New York 10012</Text>
    </View>
);

const AlphaList = ({ items = [] }) => (
    <View style={{ marginTop: 4 }}>
        {items.map((txt, i) => (
            <Text key={i} style={styles.listItem}>
                ({String.fromCharCode(97 + i)}) {txt}
            </Text>
        ))}
    </View>
);

const ExhibitTable = ({ tracks = [] }) => {
    const headers = [
        "Track Title",
        "ISRC",
        "ISWC",
        "PRO / MLC ID",
        "Duetti Catalog ID",
    ];

    return (
        <View style={styles.table}>
            <View style={styles.tr}>
                {headers.map((h, i) => (
                    <Text
                        key={h}
                        style={[
                            styles.th,
                            i === headers.length - 1 && styles.lastCell,
                        ]}
                    >
                        {h}
                    </Text>
                ))}
            </View>

            {tracks.length === 0 ? (
                <View style={styles.tr}>
                    <Text style={[styles.td, styles.lastCell]}>
                        No tracks provided
                    </Text>
                </View>
            ) : (
                tracks.map((t, r) => (
                    <View key={r} style={styles.tr}>
                        <Text style={styles.td}>
                            {t.title || "Untitled Track"}
                        </Text>
                        <Text style={styles.td}>{t.isrc || ""}</Text>
                        <Text style={styles.td}>{t.iswc || ""}</Text>
                        <Text style={styles.td}>{t.proMlcId || ""}</Text>
                        <Text style={[styles.td, styles.lastCell]}>
                            {t.duettiCatalogId || ""}
                        </Text>
                    </View>
                ))
            )}
        </View>
    );
};

export default function AgreementPDF({
    signerName,
    signedDate,
    tracks,
    sellerParty,
}) {
    const writer = signerName || "[Writer Name]";
    const dateText = signedDate || "[Effective Date]";
    const seller = sellerParty || "the applicable seller party or parties";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header />

                <Text style={styles.h1}>
                    SYNCHRONIZATION (PUBLISHING) PRE‑CLEARANCE AGREEMENT
                </Text>

                <View style={[styles.block, styles.small]}>
                    <Text>
                        This synchronization pre‑clearance agreement (the
                        “Agreement”) is made and entered into as of {dateText}{" "}
                        (“Effective Date”), by and between {writer} (“Writer”)
                        and Duetti, Inc. (“Duetti”). Writer and Duetti are
                        hereinafter referred to individually as “Party”, and
                        collectively as the “Parties”.
                    </Text>
                </View>

                <Text style={styles.h2}>Recitals</Text>
                <View style={styles.block}>
                    <Text>
                        WHEREAS, Duetti has acquired ownership of certain sound
                        recordings (the “Masters”) pursuant to a Master Purchase
                        Agreement between {seller}&nbsp;and Duetti (the “MPA”);
                    </Text>
                    <Text>
                        WHEREAS, the Masters embody musical compositions (the
                        “Compositions”) wholly owned by Writer (the Writer owns
                        100% of the Compositions);
                    </Text>
                    <Text>
                        WHEREAS, Duetti desires the right to seek and secure
                        synchronization licensing opportunities in connection
                        with both the Masters and the Compositions for one‑stop
                        synchronization placements, including placing the
                        Masters and Compositions on third‑party, one‑stop
                        synchronization platforms; and
                    </Text>
                    <Text>
                        WHEREAS, Writer desires to authorize Duetti to enter
                        into synchronization license agreements on Writer’s
                        behalf with respect to the Compositions, on the terms
                        and conditions set forth herein.
                    </Text>
                </View>

                <Text style={styles.block}>
                    THEREFORE, in consideration of the mutual covenants and
                    promises set forth below, and for other good and valuable
                    consideration, the receipt and sufficiency of which are
                    hereby acknowledged, the Parties agree as follows:
                </Text>

                {/* 1. Grant of Rights */}
                <View style={styles.block}>
                    <Text style={styles.bold}>1. Grant of Rights:</Text>
                    <Text style={styles.indent}>
                        Writer hereby grants Duetti and the third‑party,
                        one‑stop synchronization platform(s) Duetti may contract
                        with (“One‑Stop Platform”) the irrevocable,
                        non‑exclusive, worldwide, sub‑licensable, perpetual
                        right, and authority to:
                    </Text>
                    <AlphaList
                        items={[
                            "pitch, negotiate, and secure synchronization license agreements with respect to the Compositions solely as embodied in the Masters currently owned by Duetti as listed in Exhibit A (the “Covered Works”);",
                            "enter into binding license agreements on Writer’s behalf for such Covered Works;",
                            "make changes as may be required, including but not limited to changes needed to make the Covered Works suitable for the purpose for which a license has been secured or to meet technical requirements including, without limitation, time and format and/or other requirements in accordance to standards and practices; and",
                            "use the name, biography, and likeness of the Writer in connection with the exercise of the rights granted hereunder, including for promotional and marketing purposes.",
                        ]}
                    />
                    <Text style={styles.indent}>
                        Duetti may exploit the rights granted herein without
                        further approval from Writer. For the avoidance of
                        doubt, the One‑Stop Platform(s) are only granted the
                        above referenced rights for the term of the agreement
                        they have entered into with Duetti.
                    </Text>
                </View>

                {/* 2. Scope of Rights */}
                <View style={styles.block}>
                    <Text style={styles.bold}>2. Scope of Rights:</Text>
                    <Text style={styles.indent}>
                        This authorization only applies to Compositions: (a)
                        fully owned by Writer; and (b) which are embodied in the
                        specific Masters currently owned by Duetti as listed in
                        Exhibit A. This Agreement does not apply to any future
                        Masters acquired by Duetti after the Effective Date. If
                        Duetti acquires additional masters from the Writer after
                        the Effective Date, the Parties may enter into a
                        subsequent synchronization publishing pre‑clearance
                        agreement related to the compositions embodied therein.
                    </Text>
                </View>

                {/* 3. Warranties and Representations */}
                <View style={styles.block}>
                    <Text style={styles.bold}>
                        3. Warranties and Representations:
                    </Text>
                    <AlphaList
                        items={[
                            "it owns and controls 100% of the rights (including all publishing rights) in the Compositions comprising the Covered Works;",
                            "no third‑party consents, licenses, or approvals are required for Duetti to exercise the rights granted herein;",
                            "the exercise by Duetti of the rights granted herein will not infringe or violate the rights of any third party; and",
                            "it is not subject to a co‑publishing or administration agreement with a third party.",
                        ]}
                    />
                </View>

                {/* 4. Compensation */}
                <View style={styles.block}>
                    <Text style={styles.bold}>4. Compensation:</Text>
                    <Text style={styles.indent}>
                        Duetti shall pay to Writer 100% of the gross publishing
                        synchronization license fees (i.e., excluding only
                        third‑party costs and taxes payable by Duetti, if any)
                        actually received by Duetti in connection with the
                        Covered Works. The fee for each publishing license shall
                        be no less favorable than the fee charged by Duetti for
                        the corresponding master use license (i.e., MFN basis).
                    </Text>
                </View>

                {/* 5. Accounting and Payment */}
                <View style={styles.block}>
                    <Text style={styles.bold}>5. Accounting and Payment:</Text>
                    <Text style={styles.indent}>
                        Duetti shall account to Writer for all income received
                        under this Agreement no less frequently than
                        semi‑annually, within sixty (60) days after the end of
                        each calendar half‑year, together with reasonable
                        supporting documentation.
                    </Text>
                </View>

                {/* 6. No Obligation */}
                <View style={styles.block}>
                    <Text style={styles.bold}>
                        6. No Obligation to Exploit:
                    </Text>
                    <Text style={styles.indent}>
                        Nothing herein shall obligate Duetti to seek, solicit,
                        or secure any synchronization licenses, and Duetti makes
                        no warranty as to the volume or value of any such
                        licenses.
                    </Text>
                </View>

                {/* 7. Misc */}
                <View style={styles.block}>
                    <Text style={styles.bold}>7. Miscellaneous</Text>
                    <Text style={styles.indent}>
                        a. <Text style={styles.bold}>Independent Parties.</Text>{" "}
                        Nothing herein shall be deemed to create a partnership,
                        joint venture, or employment relationship between the
                        parties.
                    </Text>
                    <Text style={styles.indent}>
                        b. <Text style={styles.bold}>Entire Agreement.</Text>{" "}
                        This Agreement, together with the applicable MPA(s),
                        constitutes the entire agreement between the Parties
                        with respect to the subject matter hereof.
                    </Text>
                    <Text style={styles.indent}>
                        c. <Text style={styles.bold}>Independent Counsel.</Text>{" "}
                        Parties have carefully read and understand this
                        Agreement and acknowledge they have been advised by
                        legal counsel of their own choosing or have had the
                        opportunity to seek legal counsel in connection with
                        this Agreement.
                    </Text>
                    <Text style={styles.indent}>
                        d. <Text style={styles.bold}>Governing Law.</Text> This
                        Agreement shall be governed by and construed in
                        accordance with the laws of the State of New York,
                        without regard to its conflicts of laws principles. Each
                        Party hereto consents to submit to the personal
                        jurisdiction of such state or federal court located in
                        New York County.
                    </Text>
                    <Text style={styles.indent}>
                        e. <Text style={styles.bold}>Amendment.</Text> No
                        amendment to this Agreement shall be valid unless in
                        writing and signed by both Parties.
                    </Text>
                    <Text style={styles.indent}>
                        f. <Text style={styles.bold}>Counterparts.</Text> This
                        Agreement may be executed in any number of counterparts,
                        each of which shall be deemed an original. The delivery
                        of a signed counterpart of a signature page to this
                        Agreement by email or other electronic means shall be
                        deemed effective as delivery.
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Signatures */}
                <View style={styles.sigGroup}>
                    <Text style={styles.bold}>IN WITNESS WHEREOF</Text>
                    <Text>
                        the parties have executed this Agreement as of the
                        Effective Date.
                    </Text>
                </View>

                <View style={styles.sigLine}>
                    <Text style={[styles.bold, { marginTop: 8 }]}>
                        AGREED AND ACCEPTED:
                    </Text>
                    <Text style={{ marginTop: 12 }}>Duetti, Inc.</Text>
                    <Text style={{ marginTop: 28 }}>
                        ______________________________________
                    </Text>
                    <Text>Name: Christopher Nolte</Text>
                    <Text>Title: Authorized Signatory</Text>
                </View>

                <View style={styles.sigLine}>
                    <Text style={[styles.bold, { marginTop: 8 }]}>
                        AGREED AND ACCEPTED:
                    </Text>
                    <Text style={{ marginTop: 12 }}>{writer}</Text>
                    <Text style={{ marginTop: 28 }}>
                        ______________________________________
                    </Text>
                </View>

                {/* Exhibit A */}
                <Text style={[styles.h2, { marginTop: 12 }]}>Exhibit A</Text>
                <Text>List of Covered Works (Masters and Compositions)</Text>
                <ExhibitTable tracks={tracks} />

                {/* Footer with page numbers */}
                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
}
