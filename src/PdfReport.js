import { useState } from 'react'
import Chart from 'chart.js/auto'
import { jsPDF } from 'jspdf'

const BEAUFORT_NAMES = ['Calm','Light air','Light breeze','Gentle breeze','Moderate breeze',
    'Fresh breeze','Strong breeze','Near gale','Gale','Severe gale','Storm','Violent storm','Hurricane']
const BEAUFORT_MAX = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, Infinity]
const toBft = (mph) => { for (let i = 0; i < BEAUFORT_MAX.length; i++) { if (mph < BEAUFORT_MAX[i]) return i } return 12 }

const degreesToCardinal = (deg) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
    return dirs[Math.round((deg % 360) / 22.5) % 16]
}

const fmtTime = (iso) => iso ? iso.slice(11, 16) : '--:--'

const ALL_METRICS = [
    { key: 'Temperature',           unit: '°C',  marine: false },
    { key: 'Precipitation',         unit: 'mm',  marine: false },
    { key: 'Wind Speed',            unit: 'mph', marine: false },
    { key: 'Wind Gusts',            unit: 'mph', marine: false },
    { key: 'Wave Height',           unit: 'm',   marine: true  },
    { key: 'Wave Period',           unit: 's',   marine: true  },
    { key: 'Swell Height',         unit: 'm',   marine: true  },
    { key: 'Swell Period',         unit: 's',   marine: true  },
    { key: 'Sea Surface Temperature',     unit: '°C',  marine: true  },
    { key: 'Sea Level Height',     unit: 'm',   marine: true  },
    { key: 'Wind Direction',       unit: '°',   marine: false, textOnly: true },
    { key: 'Wave Direction',       unit: '°',   marine: true,  textOnly: true },
    { key: 'Swell Direction',      unit: '°',   marine: true,  textOnly: true },
    { key: 'Sunrise / Sunset',     unit: '',    marine: false, textOnly: true },
]

const getHourlyData = (wData, key) => {
    const f = wData.forecast
    const m = wData.marine
    const now = new Date()

    const slice = (timeArr, valArr) => {
        let i = timeArr.findIndex(t => new Date(t) >= now)
        if (i < 0) i = 0
        const labels = timeArr.slice(i, i + 24).map(t =>
            new Date(t).getHours().toString().padStart(2, '0') + ':00'
        )
        const vals = valArr.slice(i, i + 24).map(v => v ?? 0)
        return { labels, vals }
    }

    switch (key) {
        case 'Temperature':       return slice(f.hourly[0][1], f.hourly[1][1])
        case 'Precipitation':     return slice(f.hourly[0][1], f.hourly[7][1])
        case 'Wind Speed':        return slice(f.hourly[0][1], f.hourly[3][1])
        case 'Wind Gusts':        return slice(f.hourly[0][1], f.hourly[8][1])
        case 'Wave Height':       return slice(m.hourly[0][1], m.hourly[1][1])
        case 'Wave Period':       return slice(m.hourly[0][1], m.hourly[7][1])
        case 'Swell Height':     return slice(m.hourly[0][1], m.hourly[4][1])
        case 'Swell Period':     return slice(m.hourly[0][1], m.hourly[8][1])
        case 'Sea Surface Temp': return slice(m.hourly[0][1], m.hourly[6][1])
        case 'Sea Level Height': return slice(m.hourly[0][1], m.hourly[2][1])
        default:                  return null
    }
}

const getCurrentVal = (wData, key) => {
    const f = wData.forecast
    const m = wData.marine
    switch (key) {
        case 'Temperature':       return f.current[2][1]
        case 'Precipitation':     return f.current[3][1]
        case 'Wind Speed':        return f.current[4][1]
        case 'Wind Gusts':        return f.current[6][1]
        case 'Wave Height':       return m.current[2][1]
        case 'Wave Period':       return m.current[8]?.[1] ?? 'N/A'
        case 'Swell Height':     return m.current[7][1]
        case 'Swell Period':     return m.current[9]?.[1] ?? 'N/A'
        case 'Sea Surface Temp': return m.current[5][1]
        case 'Sea Level Height': return m.current[4][1]
        case 'Wind Direction':  { const d = f.current[5][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Wave Direction':  { const d = m.current[3][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Swell Direction': { const d = m.current[6][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Sunrise / Sunset': return `Sunrise ${fmtTime(f.daily[4][1]?.[0])}  /  Sunset ${fmtTime(f.daily[9]?.[1]?.[0])}`
        default:                  return null
    }
}

const chartToDataUrl = (labels, values, title) => {
    const canvas = document.createElement('canvas')
    canvas.width = 700
    canvas.height = 220
    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: title,
                data: values,
                borderColor: 'rgba(80,100,200,1)',
                backgroundColor: 'rgba(180,195,240,0.35)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
            }]
        },
        options: {
            animation: false,
            responsive: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { maxTicksLimit: 5 } },
                x: { grid: { color: 'rgba(0,0,0,0.06)' } }
            }
        }
    })
    const url = canvas.toDataURL('image/png')
    chart.destroy()
    return url
}

const PdfReport = ({ weatherData, geoData, darkMode}) => {
    const marineAvailable = weatherData?.marine?.current[2][1] != null

    const defaultKeys = ALL_METRICS
        .filter(m => !m.marine || marineAvailable)
        .map(m => m.key)

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(defaultKeys)
    const [generating, setGenerating] = useState(false)

    const toggle = (key) =>
        setSelected(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )

    const selectAll = () => setSelected(ALL_METRICS.filter(m => !m.marine || marineAvailable).map(m => m.key))
    const clearAll  = () => setSelected([])

    const handleDownload = async () => {
        if (!weatherData || selected.length === 0) return
        setGenerating(true)
        try {
            const doc = new jsPDF({ unit: 'mm', format: 'a4' })
            const pw = doc.internal.pageSize.getWidth()
            const margin = 14

            doc.setFontSize(20)
            doc.setTextColor(50, 60, 140)
            doc.text('Sailor Weather Report', margin, 20)

            doc.setFontSize(10)
            doc.setTextColor(90, 90, 90)
            const loc = geoData?.name
                ? `${geoData.name}, ${geoData.admin1}, ${geoData.country}`
                : 'Location unknown'
            doc.text(loc, margin, 28)
            doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin, 33)

            doc.setDrawColor(180, 185, 220)
            doc.line(margin, 36, pw - margin, 36)

            let y = 43

            for (const key of selected) {
                const metric = ALL_METRICS.find(m => m.key === key)
                if (!metric) continue
                if (y > 245) { doc.addPage(); y = 20 }

                const cur = getCurrentVal(weatherData, key)
                const hourly = getHourlyData(weatherData, key)

                doc.setFontSize(13)
                doc.setTextColor(50, 60, 140)
                doc.text(key, margin, y)
                y += 5

                doc.setFontSize(10)
                doc.setTextColor(40, 40, 40)
                if (cur !== null && cur !== undefined) {
                    if (metric.textOnly) {
                        doc.text(String(cur), margin, y)
                    } else {
                        doc.text(`Current: ${cur} ${metric.unit}`, margin, y)
                        if (key === 'Wind Speed' || key === 'Wind Gusts') {
                            const bft = toBft(parseFloat(cur))
                            doc.setTextColor(100, 100, 100)
                            doc.text(`  Beaufort ${bft} — ${BEAUFORT_NAMES[bft]}`, margin + 52, y)
                            doc.setTextColor(40, 40, 40)
                        }
                    }
                    y += 5
                }

                if (!metric.textOnly && !metric.textOnly && hourly) {
                    const imgData = chartToDataUrl(hourly.labels, hourly.vals, key)
                    const imgW = pw - margin * 2
                    const imgH = imgW * (220 / 700)
                    if (y + imgH > 280) { doc.addPage(); y = 20 }
                    doc.addImage(imgData, 'PNG', margin, y, imgW, imgH)
                    y += imgH + 10
                }

                doc.setDrawColor(220, 220, 235)
                doc.line(margin, y, pw - margin, y)
                y += 6
            }

            const filename = `weather-${geoData?.name ?? 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`
            doc.save(filename.replace(/\s+/g, '-').toLowerCase())
        } catch (e) {
            console.error('PDF error:', e)
        }
        setGenerating(false)
    }

    const visible = ALL_METRICS.filter(m => !m.marine || marineAvailable)

    return (
        <div className="row mx-auto">
            <button
                className={darkMode ? "btn btn-dark mb-2 mx-auto col-12 col-md-2" : "btn btn-light mb-2 mx-auto col-12 col-md-2"}
                onClick={() => setOpen(o => !o)}
                disabled={!weatherData}
            >
                Download PDF Report {open ? '▲' : '▼'}
            </button>

            {open && (
                <div className={darkMode ? "card border-0 shadow mb-1 bg-dark text-white" : "card border-0 shadow mb-1 bg-light text-dark"}>
                    <div className="card-body">
                        <p className='text-center'>Select what to include:
                            <button className='btn btn-secondary btn-sm mx-1' onClick={selectAll}>Select All</button>
                            <button className='btn btn-secondary btn-sm mx-1' onClick={clearAll}>Select None</button>
                        </p>
                        <div className="row row-cols-2 row-cols-md-3 g-1 mb-3">
                            {visible.map(m => (
                                <div key={m.key} className="col">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`pdf-${m.key}`}
                                            checked={selected.includes(m.key)}
                                            onChange={() => toggle(m.key)}
                                        />
                                        <label className="form-check-label small" htmlFor={`pdf-${m.key}`}>
                                            {m.key}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className={"btn btn-primary btn-sm"}
                            onClick={handleDownload}
                            disabled={generating || selected.length === 0}
                        >
                            {generating ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PdfReport
