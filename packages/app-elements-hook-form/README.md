# App Elements Hook Form compatibility layer

A set of form elements to be used with `react-hook-form`.

## How to use it in your application

1. Install this package as dependency along with react-hook-form main package

```sh
pnpm install react-hook-form @commercelayer/app-elements-hook-form
```

2. Check `react-hook-form` documentation to initialize an instance of `useForm()`. This will keep all the form logic and be responsible of input validation and form state.

3. Import `<Form>` component and spread returned values from `useForm()`

4. Add all fields you need inside `<Form>` component. It acts as main context provider, fields cannot be used outside of it.

5. Validation logic needs to be applied using `react-hook-form` resolver, by passing a validation schema (eg: zod or yup)

## Full example

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Input,
  InputToggleBox,
  InputDate,
  InputDateRange,
  InputSelect,
} from "@commercelayer/app-elements-hook-form";

function MyForm() {
  const methods = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <Form {...methods} onSubmit={(values) => myPostToServer(values)}>
      <Input name="companyName" label="Company name" />
      <InputDate name="dateSingle" label="Date" />
      <InputDateRange name="dateRange" label="Date range" />
      <InputSelect name="select" label="Choose one city" initialValues={[]} />
      <InputToggleBox name="toggle" label="Toggle me" id="toggle" />
    </Form>
  );
}
```
