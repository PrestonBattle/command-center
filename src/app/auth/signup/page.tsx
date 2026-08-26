"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { IconAlertCircle } from "@tabler/icons-react";
import { Panel } from "@/global/components/panel/panel";
import { registrationSchema } from "./validation";
import { RegisterUserOrg } from "./actions/register";



/**
 * One panel, no stepper. The volunteer form needed six steps because it
 * had twenty-plus fields; this has six. Splitting them up would add five
 * clicks and hide the best thing about the form -- that it's short.
 *
 * The same zod schema runs here (instant feedback) and again on the server
 * (the check that actually counts). Client validation is a courtesy; it is
 * never the security boundary.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      orgName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registrationSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    setFormError(null);

    startTransition(async () => {
      const result = await RegisterUserOrg(values);

      if (!result.success) {
        // The duplicate-email case belongs on the field, not in a banner --
        // it's about one specific input the user can go fix.
        if (result.error?.includes("already exists")) {
          form.setFieldError("email", result.error);
        } else {
          setFormError(result.error ?? "Something went wrong. Try again.");
        }
        return;
      }

      router.push("/");
    });
  });

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <Text
            size="sm"
            className="uppercase tracking-[0.18em] text-paper/70"
          >
            Ready to take command of your business? signup now
          </Text>
          
        </header>

        <Panel plain>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              {formError && (
                <Alert
                  color="red"
                  icon={<IconAlertCircle size={16} />}
                  title="Couldn't create your account"
                >
                  {formError}
                </Alert>
              )}

              <Group grow>
                <TextInput
                  label="First name"
                  autoComplete="given-name"
                  {...form.getInputProps("firstName")}
                />
                <TextInput
                  label="Last name"
                  autoComplete="family-name"
                  {...form.getInputProps("lastName")}
                />
              </Group>

              <TextInput
                label="Business name"
                placeholder="Acme Dental"
                description="You can change this later."
                autoComplete="organization"
                {...form.getInputProps("orgName")}
              />

              <TextInput
                label="Phone"
                placeholder="(904) 555-0100"
                autoComplete="tel"
                {...form.getInputProps("phone")}
              />

              <Divider my={4} />

              <TextInput
                label="Email"
                placeholder="you@acmedental.com"
                autoComplete="email"
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                description="At least 8 characters."
                autoComplete="new-password"
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label="Confirm password"
                autoComplete="new-password"
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" color="purple.4" fullWidth mt="sm" loading={isPending}>
                Create account
              </Button>
            </Stack>
          </form>
          
        </Panel>

        <Text className="mt-6 text-center text-paper/70" size="sm">
          Already have an account?{" "}
          <Anchor
            component={Link}
            href="/auth/login"
            size="sm"
            className="text-paper underline"
          >
            Log in
          </Anchor>
        </Text>
      </div>
    </div>
  );
}