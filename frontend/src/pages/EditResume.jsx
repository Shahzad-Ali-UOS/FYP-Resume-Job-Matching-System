import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import API from '../api/uplink';

const EditResume = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const resumeRef = useRef();
    const fileInputRef = useRef();

    const [loading, setLoading] = useState(true);
    const [profileImg, setProfileImg] = useState(null);

    const [resumeData, setResumeData] = useState({
        name: "ABC",
        role: "Medical Professional",

        contact: {
            phone: "0331-5114581",
            email: "owaisthameesud@gmail.com",
            address: "Abdur Rahim house, Madina Colony, Dera Ismail Khan."
        },

        education: {
            degree: "MBBS (Bachelor of Medicine & Surgery)",
            uni: "University of Sargodha",
            years: "2018 – 2023"
        },

        skills: [
            "Clinical Diagnosis",
            "Patient Management",
            "Emergency Care",
            "Medical Research",
            "Pharmacology",
            "Health Informatics"
        ],

        description:
            "Compassionate Medical Officer with experience in clinical diagnosis and primary patient care. Committed to improving healthcare outcomes through evidence-based medicine and clinical research.",

        experience: [
            "DHO Hospital (2024–Present): Managed patient inflow in the Emergency Ward, handling 30+ critical cases daily.",
            "House Officer: Conducted clinical rounds and assisted in complex surgical procedures during a one-year internship."
        ]
    });

    // FETCH DATA
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await API.get(`users/resumes/${resumeId}/`);
                const data = res.data;

                setResumeData({
                    name: data.title || "ABC",
                    role: data.job_title || "Medical Professional",

                    contact: {
                        phone: data.phone || "0331-5114581",
                        email: data.user_email || "email@gmail.com",
                        address: data.address || "Pakistan"
                    },

                    education: {
                        degree: data.degree || "Bachelor Degree",
                        uni: data.university || "University",
                        years: data.education_years || "2020-2024"
                    },

                    skills: data.skills
                        ? data.skills.split(',')
                        : [],

                    description:
                        data.extracted_text?.substring(0, 350) ||
                        "Description",

                    experience: data.experience
                        ? data.experience.split('|')
                        : ["Experience"]
                });

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (resumeId) fetchResume();
    }, [resumeId]);

    // EDITABLE HANDLER
    const handleChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // CONTACT EDIT
    const handleContactChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [field]: value
            }
        }));
    };

    // EDUCATION EDIT
    const handleEducationChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [field]: value
            }
        }));
    };

    // SKILLS EDIT
    const handleSkillChange = (index, value) => {
        const updated = [...resumeData.skills];
        updated[index] = value;

        setResumeData(prev => ({
            ...prev,
            skills: updated
        }));
    };

    // EXPERIENCE EDIT
    const handleExperienceChange = (index, value) => {
        const updated = [...resumeData.experience];
        updated[index] = value;

        setResumeData(prev => ({
            ...prev,
            experience: updated
        }));
    };

    // IMAGE
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImg(URL.createObjectURL(file));
        }
    };

    // PRINT
    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        documentTitle: `${resumeData.name}_Resume`,

        pageStyle: `
            @page {
                size: A4;
                margin: 0;
            }

            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
            }
        `
    });

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#111827] text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111827] flex items-center justify-center p-10">

            {/* TOP BUTTONS */}
            <div className="fixed top-6 right-6 z-50 flex gap-3">

                <button
                    onClick={() => navigate(-1)}
                    className="bg-white text-black px-5 py-2 rounded-md font-semibold"
                >
                    Back
                </button>

                <button
                    onClick={handlePrint}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-md font-semibold"
                >
                    Download PDF
                </button>
            </div>

            {/* RESUME */}
            <div
                ref={resumeRef}
                className="w-[794px] h-[1123px] bg-white shadow-2xl flex overflow-hidden"
            >

                {/* LEFT SIDE */}
                <div className="w-[280px] bg-[#2f3948] text-white px-7 py-6 flex flex-col">

                    {/* IMAGE */}
                    <div className="border-[4px] border-[#8b3dff] w-[110px] h-[110px] overflow-hidden mb-7">

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />

                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="w-full h-full cursor-pointer"
                        >
                            {profileImg ? (
                                <img
                                    src={profileImg}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    alt="default"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div className="mb-8">

                        <h2 className="text-[18px] font-bold border-b border-gray-400 pb-2 mb-3">
                            Contact
                        </h2>

                        <div className="mb-4">
                            <p className="font-bold text-[13px]">
                                Phone
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                    handleContactChange('phone', e.target.innerText)
                                }
                                className="text-[11px] outline-none"
                            >
                                {resumeData.contact.phone}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="font-bold text-[13px]">
                                Email
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                    handleContactChange('email', e.target.innerText)
                                }
                                className="text-[11px] break-words outline-none"
                            >
                                {resumeData.contact.email}
                            </p>
                        </div>

                        <div>
                            <p className="font-bold text-[13px]">
                                Address
                            </p>

                            <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                    handleContactChange('address', e.target.innerText)
                                }
                                className="text-[11px] leading-5 outline-none"
                            >
                                {resumeData.contact.address}
                            </p>
                        </div>
                    </div>

                    {/* EDUCATION */}
                    <div className="mb-8">

                        <h2 className="text-[18px] font-bold border-b border-gray-400 pb-2 mb-3">
                            Education
                        </h2>

                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                                handleEducationChange('degree', e.target.innerText)
                            }
                            className="font-bold text-[15px] leading-5 outline-none"
                        >
                            {resumeData.education.degree}
                        </p>

                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                                handleEducationChange('uni', e.target.innerText)
                            }
                            className="font-bold text-[15px] leading-5 mt-2 outline-none"
                        >
                            {resumeData.education.uni}
                        </p>

                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                                handleEducationChange('years', e.target.innerText)
                            }
                            className="font-bold text-[15px] leading-5 mt-2 outline-none"
                        >
                            {resumeData.education.years}
                        </p>
                    </div>

                    {/* SKILLS */}
                    <div>

                        <h2 className="text-[18px] font-bold border-b border-gray-400 pb-2 mb-3">
                            Skills
                        </h2>

                        <div className="space-y-1">

                            {resumeData.skills.map((skill, index) => (
                                <p
                                    key={index}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                        handleSkillChange(index, e.target.innerText)
                                    }
                                    className="font-bold text-[16px] leading-5 outline-none"
                                >
                                    {skill}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 px-7 py-12 text-[#2d3748]">

                    {/* NAME */}
                    <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                            handleChange('name', e.target.innerText)
                        }
                        className="text-[50px] font-bold tracking-wide mb-4 outline-none"
                    >
                        {resumeData.name}
                    </h1>

                    {/* ROLE */}
                    <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                            handleChange('role', e.target.innerText)
                        }
                        className="text-[24px] mb-14 outline-none"
                    >
                        {resumeData.role}
                    </p>

                    {/* DESCRIPTION */}
                    <div className="mb-24">

                        <h2 className="text-[34px] font-bold mb-4">
                            Description
                        </h2>

                        <p
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                                handleChange('description', e.target.innerText)
                            }
                            className="text-[18px] leading-9 text-justify outline-none"
                        >
                            {resumeData.description}
                        </p>
                    </div>

                    {/* EXPERIENCE */}
                    <div>

                        <h2 className="text-[34px] font-bold border-b border-gray-400 pb-3 mb-8">
                            Experience
                        </h2>

                        <ul className="list-disc pl-8 space-y-8">

                            {resumeData.experience.map((exp, index) => (
                                <li
                                    key={index}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                        handleExperienceChange(index, e.target.innerText)
                                    }
                                    className="text-[20px] font-bold leading-8 outline-none"
                                >
                                    {exp}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditResume;