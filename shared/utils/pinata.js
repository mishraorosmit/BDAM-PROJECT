export async function uploadToPinata(file){
    console.log("Pinata upload not implemented yet");
    return "TEMP_CID";
}

/**
 *  
 * Upload file to Pinata IPFS 
 * @param {File} file - file from input 
 * @returns {Promise<string>} CID (IPFS hash) 
 */

export async function uploadToPinata(file){
    try{
        // 1. API ENDPOINT : 
        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

        // 2. Create form data (required for file upload) :
        const formData = new FormData();
        formData.append("file", file);

        // 3. Send Request :
        const response = await fetch(url, {
            method : "POST",
            headers : {
                Authorization: `bearer ${import.meta.env.VITE_PINATA_JWT}`,  
            },
            body : formData,
        });

        // 4. Handle errors : 
        if (!response.ok){
            throw new Error("Pinata Upload Failed");
        }

        // 5. Convert Response :
        const data = await response.json();

        // 6. Return CID :
        return data.IpfsHash;

    } catch (error){
        console.error("Upload Error", error);
        throw error;
    }
}