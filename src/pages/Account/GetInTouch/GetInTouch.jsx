import { useState, useEffect } from "react";
import { PrimaryHeading } from "../../../components/Typography/Titles/Titles";

export const GetInTouch = ({ user }) => {

    const [reportForm, setReportForm] = useState({
        anonymity: false,
        message: '',
    });
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('Submitting report...');

    useEffect(() => {
        if (reportForm.anonymity) {
            const { username, email, ...rest } = reportForm;
            setReportForm(rest);
        } else {
            setReportForm({
                ...reportForm,
                username: user.username,
                email: user.email,
            });
        }
    }, [reportForm.anonymity, user.username, user.email])

    const handleCheckboxChange = (e) => {
        setReportForm({
            ...reportForm,
            anonymity: e.target.checked,
        });
    };

    const handleMessageChange = (e) => {
        setReportForm({
            ...reportForm,
            message: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const response = await fetch('/api/reports/handleUserReport', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportForm),
            });
        
            if (response.ok) {
                setUploadMsg('Report submitted successfully. Thank you.');
                setReportForm({
                    anonymity: false,
                    message: '',
                })
                setTimeout(() => {
                    setUploading(false);
                    setUploadMsg('Submitting report...');
                }, 2000);
            } else {
                setUploadMsg('Error submitting report. Please try again later.');
                setTimeout(() => {
                    setUploading(false);
                    setUploadMsg('Submitting report...');
                }, 2000);
            }

        } catch (error) {
            console.error(error);
            setUploadMsg('Error submitting report. Please try again later.');
            setTimeout(() => {
                setUploading(false);
                setUploadMsg('Submitting report...');
            }, 2000);

        }
    };

    return (
        <div className="get-in-touch page-padding bckgrd-black">
            <PrimaryHeading
                title="Get in touch"
                accentColour="blue"
                backgroundColour="white"
                textColour="black"
            />
            <p className='text'>Get in touch with The Gridlock Team to report an issue. Suggestions on app improvements and development are also welcome.</p>
            {uploading ? (
                <div className="uploading">
                    <p>{uploadMsg}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className='report-form'>
                    <label htmlFor="anonymity" className='checkbox'>
                        <input
                            type="checkbox"
                            name="anonymity"
                            id="anonymity"
                            onChange={handleCheckboxChange}
                        />
                        Check this box to make this report anonymously
                    </label>
                    <textarea
                        placeholder="Report an issue or make a suggestion here..."
                        value={reportForm.message}
                        onChange={handleMessageChange}
                        required
                    ></textarea>
                    <input type="submit" value="Send Message" className="btn btn-black" />
                </form>
            )}
        </div>
    )
}