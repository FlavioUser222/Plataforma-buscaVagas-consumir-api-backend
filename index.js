const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();
const app = express()

app.use(express.json());
app.use(cors())

app.post('/jobs', async (req, res) => {
    const { query } = req.body


    try {
        const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
            params: { query: query , page: "1" },
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            },
        });
        const jobsData = response.data.data;

        const jobs = jobsData.map((job) => ({
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city || job.job_country,
            link: job.job_apply_link,
        }))

        res.json({ total: jobs.length, jobs })

    } catch (error) {
        console.error("Erro ao buscar vagas:", error.response?.data || error);
        res.status(500).json({ error: "Erro ao buscar vagas no LinkedIn" });
    }
})


app.listen(process.env.PORT, () => {
    console.log("Servidor rodando")
})