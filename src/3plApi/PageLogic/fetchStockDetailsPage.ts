import { fetchEndpoint } from "../fetchingAPI.js";

const fetchStockDetailPage = async (page, accessToken, customerId) => {
    const url = `https://secure-wms.com/inventory/stockdetails?customerid=${customerId}&facilityid=1&rql=onHand=gt=0&pgsiz=500&pgnum=${page}`;
    const data = await fetchEndpoint(url, accessToken);
    if (!data || !data._embedded || !data._embedded.item) {
        console.error(`Invalid data structure / Empty data received from the API: ${JSON.stringify(data)}`);
        return {
            totalResults: 0, 
            item: []
        };
    }
    
    return {
        totalResults: data.totalResults,
        item: data._embedded.item
    };

};

const fetchStockDetailAllPages = async (accessToken, customerId) => {
    let page = 1;
    let consolidatedData;
    let pagePromises = [];
    let pageSize = 500;
    let totalPages;
    let totalResults = 0;

   
        try {
            const firstFetch = await fetchStockDetailPage(page, accessToken, customerId);
            totalResults = firstFetch.totalResults;
            console.log("TOTAL RESULTS:", totalResults)
            totalPages = Math.ceil(totalResults / pageSize);
            console.log("Total PAGES", totalPages);
            
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }

     while (page <= totalPages) {
        try {
            pagePromises.push(fetchStockDetailPage(page, accessToken, customerId));
            page++;
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }
    }

    try {
        const pages = await Promise.all(pagePromises);

        consolidatedData = pages.flatMap(obj => obj.item ? obj.item : null);
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }

    return consolidatedData;
};

export { fetchStockDetailAllPages, fetchStockDetailPage };
