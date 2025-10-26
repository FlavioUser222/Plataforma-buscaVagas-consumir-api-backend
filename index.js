const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config();
const app = express()

app.use(express.json());
app.use(cors())

app.post('/jobs',async(req, res) => {

    const { search, location} = req.body


    try {
        const response = await axios.post("https://linkedin-jobs-search.p.rapidapi.com/", {
            search_terms: search,
            location: location,
            page: 1,
        }, {
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "linkedin-jobs-search.p.rapidapi.com",
            },
        })

        const jobs = response.data.map((job) => ({
            title: job.job_title,
            company: job.company_name,
            location: job.job_location,
            link: job.linkedin_job_url_cleaned,
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