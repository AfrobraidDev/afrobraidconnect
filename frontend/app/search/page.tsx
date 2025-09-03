import BrowseByCity from "@/components/browse-by-city"
import SearchCard from "@/components/search-card"
import SearchUI from '@/components/search-ui'
import AppLayout from "@/components/app-layout"

export default function SearchPage() {
    return (
        <AppLayout>
            <SearchCard />

            <BrowseByCity />
            <SearchUI />
        </AppLayout>
    )
}