export default function Home() {
    return (
        <div className="container flex items-center justify-center h-screen w-full py-10">
            <div className=" h-fit text-center space-y-2">
                <h1 className="text-2xl font-semibold">Duetti Sync</h1>

                <a className="btn mt-16 btn-primary w-fit" href="/admin">
                    Go to Admin
                </a>
            </div>
        </div>
    );
}
