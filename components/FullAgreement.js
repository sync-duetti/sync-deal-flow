import React from "react";

const FullAgreement = ({ sellerParty }) => {
    return (
        <div className="space-y-2 mt-2 fullAgreement">
            <p>
                <strong>WHEREAS</strong>, Duetti has acquired ownership of
                certain sound recordings (the “Masters”) pursuant to a Master
                Purchase Agreement between{" "}
                {sellerParty || (
                    <span>
                        Seller Party/Parties in all MPAs that include the
                        Covered Works
                    </span>
                )}{" "}
                and Duetti (the “MPA”);
            </p>
            <p>
                <strong>WHEREAS</strong>, the Masters embody musical
                compositions (the “Compositions”) wholly owned by Writer (the
                Writer owns 100% of the Compositions);
            </p>
            <p>
                <strong>WHEREAS</strong>, Duetti desires the right to seek and
                secure synchronization licensing opportunities in connection
                with both the Masters and the Compositions for one-stop
                synchronization placements, including placing the Masters and
                Compositions on third party, one-stop synchronization platforms;
            </p>
            <p>
                <strong>WHEREAS</strong>, Writer desires to authorize Duetti to
                enter into synchronization license agreements on Writer’s behalf
                with respect to the Compositions, on the terms and conditions
                set forth herein.
            </p>
            <p>
                <strong>THEREFORE</strong>, in consideration of the mutual
                covenants and promises set forth below, and for other good and
                valuable consideration, the receipt and sufficiency of which are
                hereby acknowledged, the parties agree as follows:
            </p>
            <ol className="space-y-2">
                <li>
                    <strong>Grant of Rights:</strong> Writer hereby grants
                    Duetti and the third party, one-stop synchronization
                    platform(s) Duetti may contract with (“One-Stop Platform”)
                    the irrevocable, non-exclusive, worldwide, sub-licensable,
                    perpetual right, and authority to:
                    <ol type="a">
                        <li>
                            pitch, negotiate, and secure synchronization license
                            agreements with respect to the Compositions solely
                            as embodied in the Masters currently owned by Duetti
                            as listed in Exhibit A (the “Covered Works”);
                        </li>
                        <li>
                            enter into binding license agreements on Writer’s
                            behalf for such Covered Works;
                        </li>
                        <li>
                            make changes as may be required, including but not
                            limited to, changes needed to make the Covered Works
                            suitable for the purpose for which a license has
                            been secured or to meet technical requirements
                            including, without limitation, time and format
                            and/or other requirements in accordance to standards
                            and practices;
                        </li>
                        <li>
                            use the name, biography, and likeness of the Writer
                            in connection with the exercise of the rights
                            granted to hereunder, including for promotional and
                            marketing purposes.
                        </li>
                    </ol>
                    Duetti may exploit the rights granted herein without further
                    approval from Writer. For the avoidance of doubt, the
                    One-Stop Platform(s) are only granted the above referenced
                    rights for the term of the agreement they have entered into
                    with Duetti.
                </li>
                <li>
                    <strong>Scope of Rights:</strong> This authorization only
                    applies to Compositions:
                    <ol type="a">
                        <li>fully owned by Writer; and</li>
                        <li>
                            which are embodied in the specific Masters currently
                            owned by Duetti as listed in Exhibit A.
                        </li>
                    </ol>
                    This Agreement does not apply to any future Masters acquired
                    by Duetti after the date hereof. If Duetti acquires
                    additional masters from the Writer after the Effective Date,
                    the Parties may enter into a subsequent synchronization
                    publishing pre-clearance agreement related to the
                    compositions embodied therein.
                </li>
                <li>
                    <strong>Warranties and Representations:</strong> The Writer
                    represents, warrants, and covenants that:
                    <ol type="a">
                        <li>
                            it owns and controls 100% of the rights (including
                            all publishing rights) in the Compositions
                            comprising the Covered Works;
                        </li>
                        <li>
                            no third-party consents, licenses, or approvals are
                            required for Duetti to exercise the rights granted
                            herein;
                        </li>
                        <li>
                            the exercise by Duetti of the rights granted herein
                            will not infringe or violate the rights of any third
                            party;
                        </li>
                        <li>
                            it is not subject to a co-publishing or
                            administration agreement with a third party.
                        </li>
                    </ol>
                </li>
                <li>
                    <strong>Compensation:</strong> Duetti shall pay to Writer
                    100% of the gross publishing synchronization license fees
                    (i.e., excluding only third-party costs and taxes payable by
                    Duetti, if any) actually received by Duetti in connection
                    with the Covered Works. The fee for each publishing license
                    shall be no less favorable than the fee charged by Duetti
                    for the corresponding master use license (i.e., MFN basis).
                </li>
                <li>
                    <strong>Accounting and Payment:</strong> Duetti shall
                    account to Writer for all income received under this
                    Agreement no less frequently than semi-annually, within
                    sixty (60) days after the end of each calendar half-year,
                    together with reasonable supporting documentation.
                </li>
                <li>
                    <strong>No Obligation to Exploit:</strong> Nothing herein
                    shall obligate Duetti to seek, solicit, or secure any
                    synchronization licenses, and Duetti makes no warranty as to
                    the volume or value of any such licenses.
                </li>
                <li>
                    <strong>Miscellaneous</strong>
                    <ol type="a">
                        <li>
                            <strong>Independent Parties.</strong> Nothing herein
                            shall be deemed to create a partnership, joint
                            venture, or employment relationship between the
                            parties.
                        </li>
                        <li>
                            <strong>Entire Agreement.</strong> This Agreement,
                            together with the MPA(s), constitutes the entire
                            agreement between the Parties with respect to the
                            subject matter hereof.
                        </li>
                        <li>
                            <strong>Independent Counsel.</strong> Parties have
                            carefully read and understand this Agreement and
                            acknowledge they have been advised by legal counsel
                            of their own choosing or have had the opportunity to
                            seek legal counsel in connection with this
                            Agreement.
                        </li>
                        <li>
                            <strong>Governing Law.</strong> This Agreement shall
                            be governed by and construed in accordance with the
                            laws of the State of New York, without regard to its
                            conflicts of laws principles. Each Party hereto
                            consents to submit to the personal jurisdiction of
                            such state or federal court located in New York
                            County.
                        </li>
                        <li>
                            <strong>Amendment.</strong> No amendment to this
                            Agreement shall be valid unless in writing and
                            signed by both Parties.
                        </li>
                        <li>
                            <strong>Counterparts.</strong> This Agreement may be
                            executed in any number of counterparts, each of
                            which shall be deemed an original. The delivery of a
                            signed counterpart of a signature page to this
                            Agreement by email or other electronic means shall
                            be deemed effective as delivery.
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
    );
};

export default FullAgreement;
