import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import BarIdUploader from './BarIdUploader';

const VerificationForm = ({ onSubmit, isLoading }) => {
    const [file, setFile] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleFormSubmit = (data) => {
        if (!file) return;
        onSubmit({ ...data, file });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="barNumber">Bar Council Enrollment Number</Label>
                    <Input
                        id="barNumber"
                        placeholder="e.g. 2023/12345"
                        className="bg-background"
                        {...register("barNumber", { required: "Bar number is required" })}
                    />
                    {errors.barNumber && (
                        <p className="text-xs text-destructive">{errors.barNumber.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Bar Council / Association</Label>
                    <Select onValueChange={(value) => setValue("barCouncil", value)}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select your Bar Council" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bangladesh_bar_council">Bangladesh Bar Council</SelectItem>
                            <SelectItem value="supreme_court">Supreme Court Bar Association</SelectItem>
                            <SelectItem value="dhaka">Dhaka Bar Association</SelectItem>
                            <SelectItem value="chittagong">Chittagong District Bar Association</SelectItem>
                            <SelectItem value="sylhet">Sylhet District Bar Association</SelectItem>
                            <SelectItem value="rajshahi">Rajshahi Bar Association</SelectItem>
                            <SelectItem value="khulna">Khulna Bar Association</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Upload Bar ID Card</Label>
                    <BarIdUploader
                        onFileSelect={setFile}
                        selectedFile={file}
                        onClear={() => setFile(null)}
                    />
                    {!file && (
                        <p className="text-xs text-muted-foreground">
                            Please upload a clear image of your Bar Council ID card.
                        </p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !file}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Submit for Verification
                    </>
                )}
            </Button>
        </form>
    );
};

export default VerificationForm;
