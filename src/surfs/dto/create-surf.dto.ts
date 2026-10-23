import { IsDateString, IsInt, IsUUID, Matches, Min } from "class-validator";

export class CreateSurfDto {
    @IsUUID()
    peakId: string;

    @IsInt()
    @Min(0)
    wavesCount: number;

    @IsInt()
    @Min(0)
    durationMinutes: number;

    @IsDateString({ strict: true})
    @Matches(/(?:Z|[+-]\d{2}:\d{2})$/)
    surfedAt: string;
}