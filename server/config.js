module.exports = {
    aws_remote_config : {
        accessKeyId: process.env.KEYID,
        secretAccessKey : process.env.PASSWORD,
        region: 'us-east-2'
    },
    buckerURL: 'https://sm1-proyecto2-201612118.s3.us-east-2.amazonaws.com/',
    bucketName: 'sm1-proyecto2-201612118',
    bucketID : process.env.KEYIDBUCKET,
    bucketPassword: process.env.PASSWORDBUCKET
}