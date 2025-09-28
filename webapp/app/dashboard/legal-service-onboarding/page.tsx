"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, UseFormRegister, Path, FieldErrors, get } from 'react-hook-form';
import api from '@/lib/api';
import { Check, Plus, Trash2, UploadCloud, RotateCw } from 'lucide-react';

// --- Type Definitions for Form Data ---
type ServiceOffering = {
    name: string;
    rate: string;
    billingCycle: string;
};

type FormValues = {
    gstin: string;
    firmName: string;
    contactNumber: string;
    address: string;
    city: string;
    taluka?: string;
    state: string;
    pincode: string;
    email: string;
    website?: string;
    registrationDate?: string;
    companyAge?: string;
    annualTurnover?: string;
    serviceCategories: string[];
    otherCategory?: string;
    serviceOfferings: ServiceOffering[];
    aadhaarLast4: string;
    pan: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branchName: string;
    upiId?: string;
    paymentMode: string;
    declaration1: boolean;
    declaration2: boolean;
    declaration3: boolean;
    declaration4: boolean;
    esignAadhaar: string;
    esignOtp: string;
    submissionDate?: string;
};


// --- Reusable Components ---
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
        <div className="space-y-6">
            {children}
        </div>
    </section>
);

const InputField = ({ label, errors, ...props }: { label: string, errors: FieldErrors<FormValues>, [key: string]: any }) => {
    // `get` safely retrieves nested error messages from react-hook-form's error object.
    const error = get(errors, props.name);
    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input id={props.name} {...props} className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05134]/50 focus:border-[#F05134]`} />
            {error && <p className="text-xs text-red-600 mt-1">{error.message as string}</p>}
        </div>
    );
};

const CheckboxGroup = ({ title, options, register, name, errors }: { title: string, options: string[], register: UseFormRegister<FormValues>, name: Path<FormValues>, errors: FieldErrors<FormValues> }) => {
    const error = get(errors, name);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map(option => (
                    <label key={option} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-[#F05134]">
                        <input type="checkbox" {...register(name, { required: "Please select at least one category." })} value={option} className="h-4 w-4 rounded border-gray-300 text-[#F05134] focus:ring-[#F05134]" />
                        <span className="font-medium text-sm text-gray-800">{option}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-xs text-red-600 mt-2">{error.message as string}</p>}
        </div>
    );
};

const CheckboxField = ({ label, errors, ...props }: { label: string, errors: FieldErrors<FormValues>, [key: string]: any }) => {
    const error = get(errors, props.name);
    return (
        <div>
            <label className="flex items-start gap-3">
                <input type="checkbox" {...props} className="h-4 w-4 rounded border-gray-300 text-[#F05134] focus:ring-[#F05134] mt-1" />
                <span className="text-sm text-gray-700">{label}</span>
            </label>
            {error && <p className="text-xs text-red-600 mt-1 ml-7">{error.message as string}</p>}
        </div>
    );
};

const FileUpload = ({ label }: { label: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#F05134] transition">
            <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload or drag & drop</p>
        </div>
    </div>
);

// --- Main Onboarding Page Component ---
export default function LegalOnboardingPage() {
    const [isLoadingGst, setIsLoadingGst] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOtp, setShowOtp] = useState(false);

    const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            gstin: "",
            firmName: "",
            contactNumber: "",
            address: "",
            city: "",
            taluka: "",
            state: "",
            pincode: "",
            email: "",
            website: "",
            registrationDate: "",
            companyAge: "",
            annualTurnover: "",
            serviceCategories: [],
            otherCategory: "",
            serviceOfferings: [{ name: "", rate: "", billingCycle: "Per Service" }],
            aadhaarLast4: "",
            pan: "",
            accountHolderName: "",
            accountNumber: "",
            bankName: "",
            ifscCode: "",
            branchName: "",
            upiId: "",
            paymentMode: "BANK_TRANSFER",
            declaration1: false,
            declaration2: false,
            declaration3: false,
            declaration4: false,
            esignAadhaar: "",
            esignOtp: "",
            submissionDate: "",
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "serviceOfferings" });

    const handleGstFetch = async () => {
        setIsLoadingGst(true);
        try {
            const response = await api.post('/verification/gst', { gstin: getValues("gstin") });
            const data = response.data;
            setValue("firmName", data.firmName || "");
            setValue("address", data.address || "");
            setValue("city", data.city || "");
            setValue("state", data.state || "");
            setValue("pincode", data.pincode || "");
            const regDate = data.registrationDate ? new Date(data.registrationDate).toISOString().split('T')[0] : "";
            setValue("registrationDate", regDate);
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to fetch GST details.");
        } finally {
            setIsLoadingGst(false);
        }
    };

    const handleSendOtp = () => {
        if (!getValues("esignAadhaar") || getValues("esignAadhaar").length !== 12) {
            alert("Please enter a valid 12-digit Aadhaar number.");
            return;
        }
        setShowOtp(true);
        alert("OTP sent to your registered mobile number (mock).");
    };
    
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            await api.post('/onboarding/submit', data);
            alert("Application submitted successfully!");
        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to submit application.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Service Provider Onboarding</h1>
                    <p className="text-gray-600">Join our network of trusted Lawyers, Advocates, and Legal Professionals.</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <FormSection title="GST Verification">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <InputField label="GST Number" errors={errors}
                                    {...register("gstin", { required: "GSTIN is required.", pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "Invalid GSTIN format." } })}
                                    maxLength={15} placeholder="Enter 15-digit GSTIN" />
                            </div>
                            <div className="flex items-end">
                                <button type="button" onClick={handleGstFetch} disabled={isLoadingGst} className="w-full h-[46px] flex justify-center items-center gap-2 px-4 py-2 border border-[#F05134] text-[#F05134] bg-white rounded-lg hover:bg-[#F05134]/10 transition disabled:opacity-50">
                                    {isLoadingGst ? <RotateCw size={18} className="animate-spin" /> : <Check size={18} />}
                                    Fetch Details
                                </button>
                            </div>
                        </div>
                    </FormSection>
                    
                    <FormSection title="Organization Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField label="Law Firm / Organization Name" errors={errors} {...register("firmName", { required: "Firm name is required." })} placeholder="As per GST/PAN records" />
                            <InputField label="Contact Number" type="tel" errors={errors} {...register("contactNumber", { required: "Contact number is required." })} placeholder="+91 00000 00000" />
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea {...register("address", { required: "Address is required." })} rows={3} placeholder="Full address" className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05134]/50 focus:border-[#F05134]`}></textarea>
                                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
                            </div>
                            <InputField label="City" errors={errors} {...register("city", { required: "City is required." })} />
                            <InputField label="State" errors={errors} {...register("state", { required: "State is required." })} />
                            <InputField label="Pincode" errors={errors} {...register("pincode", { required: "Pincode is required." })} />
                            <InputField label="Email ID" type="email" errors={errors} {...register("email", { required: "Email is required." })} />
                            <InputField label="Taluka / Tehsil (Optional)" errors={errors} {...register("taluka")} />
                            <InputField label="Website (Optional)" type="url" errors={errors} {...register("website")} />
                            <InputField label="Date of Registration (Optional)" type="date" errors={errors} {...register("registrationDate")} />
                            <InputField label="Age of Firm (years) (Optional)" type="number" errors={errors} {...register("companyAge")} />
                        </div>
                    </FormSection>
                    
                    <FormSection title="Business Profile">
                         <CheckboxGroup title="Service Categories" name="serviceCategories" register={register} errors={errors} options={["Business Registration & Compliance", "Tax Filing & Advisory", "Legal Drafting & Dispute Support", "Audit & Certification", "Contract Vetting", "Financial Risk Advisory"]} />
                        <InputField label="Other Categories (Optional)" errors={errors} {...register("otherCategory")} placeholder="e.g., Intellectual Property" />
                    </FormSection>

                    <FormSection title="Specific Legal Services Offered">
                         {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                                <div className="md:col-span-4"><InputField label={index === 0 ? "Service Name" : ""} errors={errors} {...register(`serviceOfferings.${index}.name`, { required: "Service name cannot be empty." })} placeholder="e.g., Contract Drafting"/></div>
                                <div className="md:col-span-2"><InputField label={index === 0 ? "Rate (₹)" : ""} type="number" errors={errors} {...register(`serviceOfferings.${index}.rate`, { required: "Rate is required." })} placeholder="10000" /></div>
                                <div className="md:col-span-1">
                                    {index === 0 && <label className="block text-sm font-medium text-gray-700 mb-2">Billing</label>}
                                    <select {...register(`serviceOfferings.${index}.billingCycle`)} className="w-full h-[46px] border border-gray-300 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-[#F05134]/50 focus:border-[#F05134]"><option>Per Service</option><option>Monthly</option><option>Yearly</option></select>
                                </div>
                                <div className="md:col-span-1 flex justify-end">{index > 0 && <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>}</div>
                            </div>
                        ))}
                        <button type="button" onClick={() => append({ name: "", rate: "", billingCycle: "Per Service" })} className="mt-2 text-sm text-[#F05134] font-semibold hover:text-[#F05134]/80 transition"><Plus size={16} className="inline mr-1" />Add Another Service</button>
                    </FormSection>

                    <FormSection title="Identity & KYC Documents">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField label="Aadhaar Number (last 4 digits)" errors={errors} {...register("aadhaarLast4", { required: "Last 4 digits of Aadhaar are required.", pattern: { value: /^\d{4}$/, message: "Must be 4 digits." } })} maxLength={4} placeholder="XXXX" />
                            <InputField label="PAN Number" errors={errors} {...register("pan", { required: "PAN is required.", pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format." } })} maxLength={10} placeholder="ABCDE1234F" />
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><FileUpload label="Upload Aadhaar (masked)" /><FileUpload label="Upload PAN Card" /></div>
                    </FormSection>
                    
                    <FormSection title="Bank & Payment Details">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField label="Account Holder Name" errors={errors} {...register("accountHolderName", { required: "Account holder name is required." })} placeholder="As per bank records" />
                            <InputField label="Bank Account Number" errors={errors} {...register("accountNumber", { required: "Account number is required." })} placeholder="Enter account number" />
                            <InputField label="Bank Name" errors={errors} {...register("bankName", { required: "Bank name is required." })} />
                             <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2"><InputField label="IFSC Code" errors={errors} {...register("ifscCode", { required: "IFSC code is required." })} maxLength={11} /></div>
                                <div className="flex items-end"><button type="button" className="w-full h-[46px] flex justify-center items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition">Verify Bank</button></div>
                            </div>
                            <InputField label="Branch Name" errors={errors} {...register("branchName", { required: "Branch name is required." })} />
                            <InputField label="UPI ID (Optional)" errors={errors} {...register("upiId")} placeholder="yourname@okhdfc" />
                         </div>
                    </FormSection>

                    <FormSection title="Declaration & Consent">
                        <div className="space-y-4">
                            <CheckboxField label="I hereby declare that all information provided is true to the best of my knowledge." errors={errors} {...register("declaration1", { required: "You must agree to this declaration." })} />
                            <CheckboxField label="I authorize Solviser to verify my identity, organization, and documents." errors={errors} {...register("declaration2", { required: "You must agree to this declaration." })}/>
                            <CheckboxField label="I agree to the Solviser Service Provider Terms & Conditions." errors={errors} {...register("declaration3", { required: "You must agree to this declaration." })}/>
                            <CheckboxField label="I consent to my profile being visible to MSMEs on the Solviser platform." errors={errors} {...register("declaration4", { required: "You must agree to this declaration." })}/>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2"><InputField label="Aadhaar for eSign" errors={errors} {...register("esignAadhaar", { required: "Aadhaar is required for eSign.", pattern: { value: /^\d{12}$/, message: "Must be a 12-digit number." } })} maxLength={12} placeholder="Enter 12-digit Aadhaar" /></div>
                                <div className="flex items-end"><button type="button" onClick={handleSendOtp} className="w-full h-[46px] flex justify-center items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition">Send OTP</button></div>
                            </div>
                            {showOtp && <div className="mt-4"><InputField label="Enter OTP" errors={errors} {...register("esignOtp", { required: "OTP is required." })} placeholder="6-digit OTP" /></div>}
                        </div>
                    </FormSection>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#F05134] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}