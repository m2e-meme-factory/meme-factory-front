import * as React from "react";
import {
  Grid,
  Flex,
  TextField,
  Heading,
  Card,
  Callout, Box,
} from "@radix-ui/themes";
import {
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import * as z from "zod";
import {useTelegram} from "../../shared/hooks/useTelegram";

export const transformPhoneNumber = (phoneNumber: string) => {
//   let phoneRegex =
//     /^\+?(\d{1,3})?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
//   let match = phoneNumber.match(phoneRegex);
//
//   if (match) {
//     // Приведение номера к единому формату: +XXXXXXXXXXX
//     let standardizedPhoneNumber = `${match[1]}${match[2]}${match[3]}${match[4]}${match[5]}`;
//
//     return standardizedPhoneNumber;
//   } else {
//     return null;
//   }
// };
//
// const formDataSchema = z.object({
//   name: z.string().min(2, { message: "Имя не может быть пустым" }),
//   phone: z
//     .string()
//     .min(1, { message: "Номер телефона не может быть пустым" })
//     .regex(
//       /^\+?\d{1,3}?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/,
//       {
//         message: "Неверный формат номера телефона",
//       }
//     ),
//   email: z
//     .string()
//     .min(1, { message: "Email не может быть пустым" })
//     .email({ message: "Неверный формат email" }),
// });
//
// export default function VerifyForm() {
//   const { user, webApp } = useTelegram();
//   const tg = webApp;
//
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//
//   const [formError, setFormError] = useState<
//     | z.ZodFormattedError<
//         {
//           name: string;
//           email: string;
//           phone: string;
//         },
//         string
//       >
//     | undefined
//   >();
//
//   const [focusedInputs, setFocusedInputs] = useState<string[]>([])
//
//   const onSendData = async () => {
//     const query_id = webApp?.initDataUnsafe.query_id;
//
//     if (validate()) {
//       if (!query_id || !user) return;
//
//       const phoneNumber = transformPhoneNumber(phone);
//
//       if (!phoneNumber) return;
//
//       const payload = {
//         userId: user.id.toString(),
//         name,
//         phoneNumber,
//         email,
//       };
//
//       await verifyUser(query_id, payload);
//     }
//   };
//
//   const validate = () => {
//     const formData = formDataSchema.safeParse({
//       name,
//       phone,
//       email,
//     });
//
//     if (formData?.success) {
//       setFormError(undefined);
//
//       const phoneNumber = transformPhoneNumber(phone);
//
//       if (!phoneNumber) return;
//
//       return true;
//     } else {
//       setFormError(formData.error.format());
//     }
//
//     return;
//   };
//
//   useEffect(() => {
//     if (!tg) return;
//
//     tg.MainButton.show();
//
//     if (!validate()) {
//       tg.MainButton.setParams({
//         color: "#8fc600",
//       });
//       tg.MainButton.disable();
//     } else {
//       tg.MainButton.enable();
//       tg.MainButton.setParams({
//         color: tg.themeParams.button_color,
//       });
//     }
//   }, [phone, email, name, focusedInputs]);
//
//   useEffect(() => {
//     if (!tg) return;
//
//     tg.MainButton.setParams({
//       text: "Запонить данные",
//     });
//   }, [tg]);
//
//   // если форма не заполнена, то кнопка заблочена + серая
//   // если все поля заполнил, то кнопка активна + норм цвета
//   // useEffect(() => {
//   //   if (!tg) return;
//
//   //   tg.MainButton.show();
//
//   //   if (!from || !to || !passangersCount || !price) {
//   //     tg.MainButton.setParams({
//   //       color: "#7B7B7B",
//   //     });
//   //     tg.MainButton.disable();
//   //   } else {
//   //     tg.MainButton.enable();
//   //     tg.MainButton.setParams({
//   //       color: tg.themeParams.button_color,
//   //     });
//   //   }
//   // }, [from, to, passangersCount, price, tg]);
//
//   useEffect(() => {
//     if (!tg) return;
//
//     // @ts-ignore
//     tg.onEvent("mainButtonClicked", onSendData);
//     return () => {
//       // @ts-ignore
//       tg.offEvent("mainButtonClicked", onSendData);
//     };
//   }, [onSendData]);

  return (
      <></>
    // <Grid minHeight={"80vh"} align="center" justify={"center"}>
    //   <Box m="4"  pt="4">
    //     <Card
    //       size="3"
    //       style={{
    //         contain: "unset",
    //         overflow: "unset",
    //       }}
    //     >
    //       <Heading size="3">Заполните ваши данные</Heading>
    //       <Flex mt="4" direction="column" gap="2">
    //         <TextField.Root
    //         onBlur={(e) =>  setFocusedInputs(["name", ...focusedInputs])}
    //           size="3"
    //           placeholder="Введите имя"
    //           onChange={(e) => setName(e.target.value)}
    //         />
    //         {focusedInputs.includes("name") &&formError?.name?._errors?.map((item) => (
    //           <Callout.Root variant="surface" size={"1"} color="red">
    //             <Callout.Icon>
    //               <CrossCircledIcon />
    //             </Callout.Icon>
    //             <Callout.Text>{item}</Callout.Text>
    //           </Callout.Root>
    //         ))}
    //         <TextField.Root
    //         onBlur={(e) => setFocusedInputs(["phone", ...focusedInputs])}
    //           size="3"
    //           placeholder="Ваш телефон"
    //           onChange={(e) => setPhone(e.target.value)}
    //         />
    //         {focusedInputs.includes("phone") &&formError?.phone?._errors?.map((item) => (
    //           <Callout.Root variant="surface" size={"1"} color="red">
    //             <Callout.Icon>
    //               <CrossCircledIcon />
    //             </Callout.Icon>
    //             <Callout.Text>{item}</Callout.Text>
    //           </Callout.Root>
    //         ))}
    //         <TextField.Root
    //         onBlur={(e) => setFocusedInputs(["email", ...focusedInputs])}
    //           size="3"
    //           placeholder="Ваш Email"
    //           type="email"
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //         {focusedInputs.includes("email") && formError?.email?._errors?.map((item) => (
    //           <Callout.Root variant="surface" size={"1"} color="red">
    //             <Callout.Icon>
    //               <CrossCircledIcon />
    //             </Callout.Icon>
    //             <Callout.Text>{item}</Callout.Text>
    //           </Callout.Root>
    //         ))}
    //       </Flex>
    //     </Card>
    //   </Box>
    // </Grid>
  );
}
