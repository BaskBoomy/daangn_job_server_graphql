import crypto from 'crypto';
import { redisClient } from "../app.js";
import { config } from "../config.js";
//6자리 random 숫자 생성
export const create6DigitCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code + "";
};
// redis에 key-value 형태로 저장 : 3분후에 exprire
export const saveAuthCode = (key, value) => {
    redisClient.set(key, value);
};
export const sendMessage = async (to, code) => {
    const SERVICE_ID = config.naverCloud.serviceId;
    const signatureParams = {
        method: 'POST',
        url: `/sms/v2/services/${SERVICE_ID}/messages`,
        timestamp: Date.now() + "",
        ACCESS_KEY: config.naverCloud.accessKey,
        SECRET_KEY: config.naverCloud.secretKey,
    };
    const body = JSON.stringify({
        "type": "SMS",
        "contentType": "COMM",
        "countryCode": "82",
        "from": "01097735873",
        "content": "SNS Authentication by Jack's personal node js backend server project",
        "messages": [
            {
                "to": to,
                "content": `[당근알바 프로젝트] 인증번호 [${code}]를 입력해주세요.`
            }
        ]
    });
    const signature = makeSignature(signatureParams);
    try {
        const response = await fetch(`https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`, {
            method: signatureParams.method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-ncp-apigw-timestamp": signatureParams.timestamp,
                "x-ncp-iam-access-key": signatureParams.ACCESS_KEY,
                "x-ncp-apigw-signature-v2": signature,
            },
            body: body,
        });
        if (!response.ok) {
            throw new Error('Sending Message Error');
        }
        const result = await response.json();
        if (result.statusCode === "202") {
            console.info("문자 전송 성공");
            return Promise.resolve(true);
        }
        else {
            console.error("문자 전송 실패");
            return Promise.resolve(false);
        }
    }
    catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
};
const makeSignature = (signature) => {
    var space = " ";
    var newLine = "\n";
    const hmac = crypto.createHmac('SHA256', signature.SECRET_KEY);
    hmac.update(signature.method);
    hmac.update(space);
    hmac.update(signature.url);
    hmac.update(newLine);
    hmac.update(signature.timestamp);
    hmac.update(newLine);
    hmac.update(signature.ACCESS_KEY);
    return hmac.digest('base64');
};
export const compareAuthCode = async (key, code) => {
    const value = await redisClient.get(key);
    console.log(value);
    if (code === value) {
        redisClient.del(key);
        return Promise.resolve(true);
    }
    else {
        return Promise.resolve(false);
    }
};
