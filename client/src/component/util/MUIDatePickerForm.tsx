import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ko } from "date-fns/locale";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

const formSchema = z.object({
    selectDate: z.date({ message: "유효한 날짜를 선택해주세요." }).nullable().refine((date) => date !== null, {
        message: "날짜를 입력해주세요.",
    })
});

type FormValues = z.infer<typeof formSchema>;

function MUIDatePickerForm({ date, setData }: {
    date: Date,
    setData: React.Dispatch<React.SetStateAction<Date>>
}) {

    const outerTheme = useTheme(); // 기존의 바깥 테마를 가져옵니다.

    // 기존 테마를 기반으로 primary 색상만 덮어쓴 새로운 테마를 만듭니다.
    const neutralTheme = createTheme({
        ...outerTheme,
        palette: {
            ...outerTheme.palette,
            primary: {
                // primary 색상을 회색 계열(기본 테두리 색상)으로 변경
                main: 'rgba(0, 0, 0, 0)',
            },
        },
    });

    const { control } =
        useForm<FormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                selectDate: date,
            },
        });

    return (
        <ThemeProvider theme={neutralTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                <form>
                    <Controller
                        name="selectDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <DatePicker
                                value={field.value}
                                onChange={(updateValue) => {

                                    if (updateValue === null) {
                                        return;
                                    }
                                    setData(updateValue);
                                    field.onChange(updateValue);
                                }}
                                ref={field.ref}
                                label=""
                                format="yyyy-MM-dd"
                                sx={{
                                    fontWeight: 'bold'
                                }}
                                slotProps={{
                                    textField: {
                                        error: !!fieldState.error,
                                        helperText: fieldState.error?.message,
                                        sx: {
                                            width: '11rem',
                                            '& fieldset': { border: 'none' },
                                            '&:hover fieldset': { border: 'none' },
                                            '&.Mui-focused fieldset': { border: 'none' },
                                        },
                                    },
                                    day: {
                                        sx: {

                                            // 선택된 날짜의 스타일
                                            '&.Mui-selected': {
                                                backgroundColor: '#62a1c5ff', // 원하는 배경색
                                                color: '#eeeeeeff',           // 원하는 글자색
                                                '&:hover, &:focus': {
                                                    backgroundColor: '#62a1c5ff',
                                                }
                                            },
                                        },
                                    },

                                }}
                            >

                            </DatePicker>

                        )}>

                    </Controller>
                </form>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

export default MUIDatePickerForm;