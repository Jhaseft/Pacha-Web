"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { WithdrawalRequest } from "@/types/withdrawalRequest";
import { apiGetWithdrawalRequests } from "@/lib/withdrawalRequest";
import { AnfitrionaRequestItem } from "@/components/admin/AnfitrionaRequestItem";
import { WithdrawalDetailModal } from "@/components/admin/withdrawalModal/WithdrawalDetailModal";

export default function ListWithdrawalRequestPage() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [search, setSearch] = useState("");
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<WithdrawalRequest | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const isFirstRender = useRef(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    const loadRequests = useCallback(async (text?: string, cursor?: string) => {
        const isFirstLoad = !cursor;
        try {
            if (isFirstLoad) setIsInitialLoading(true);
            else setIsFetchingMore(true);

            const response = await apiGetWithdrawalRequests(text, cursor);
            const newData = response.data ?? [];

            setRequests((prev) => {
                if (isFirstLoad) return newData;
                const existingIds = new Set(prev.map((r) => r.id));
                return [...prev, ...newData.filter((r) => !existingIds.has(r.id))];
            });

            setNextCursor(response.nextCursor ?? null);
        } catch (e: any) {
            console.error(e.message);
        } finally {
            setIsInitialLoading(false);
            setIsFetchingMore(false);
        }
    }, []);

    useEffect(() => { loadRequests(); }, [loadRequests]);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const timer = setTimeout(() => {
            setRequests([]);
            setNextCursor(null);
            loadRequests(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, loadRequests]);

    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextCursor && !isFetchingMore && !isInitialLoading) {
                    loadRequests(search, nextCursor);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextCursor, isFetchingMore, isInitialLoading, search, loadRequests]);

    return (
        <>
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                <h1 className="text-white text-2xl font-black tracking-tight mb-4">Solicitudes de retiro</h1>

                <div className="relative mb-5">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar anfitriona"
                        className="w-full bg-[#1a1a1a] border border-gray-800 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-600"
                    />
                </div>

                {isInitialLoading ? (
                    <div className="flex justify-center mt-16">
                        <div className="w-8 h-8 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : requests.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">No hay resultados</p>
                ) : (
                    requests.map((item) => (
                        <AnfitrionaRequestItem
                            key={item.id}
                            item={item}
                            onPress={() => { setSelectedItem(item); setModalVisible(true); }}
                        />
                    ))
                )}

                <div ref={loaderRef} className="h-4" />

                {isFetchingMore && (
                    <div className="flex justify-center my-3">
                        <div className="w-6 h-6 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <WithdrawalDetailModal
                visible={modalVisible}
                item={selectedItem}
                onClose={() => setModalVisible(false)}
                onSuccess={() => { setModalVisible(false); loadRequests(); }}
            />
        </>
    );
}
