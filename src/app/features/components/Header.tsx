import Link from "next/link";

export function Header() {
    return (
        <header className="app-header flex justify-between w-full py-3 bg-blue-400 ">
            <Link className="ml-2" href="/">Cook Storage</Link>
            <div className="flex gap-4 mx-2">
                {/* <Link href="/">料理一覧</Link> */}
                {/* <Link href="/">タグ一覧</Link> */}
            </div>
        </header>
    );
}
