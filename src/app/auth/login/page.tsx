"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { IconAlertCircle } from "@tabler/icons-react";
import { Panel } from "@/global/components/panel/panel";
import { loginSchema } from "./validation";
import { LoginUser } from "./actions/login";


/**
 * Two fields, one panel.
 *
 * Unlike signup, errors here never land on a specific field. "Wrong
 * password" on the password input would confirm the email exists, which
 * is exactly the thing worth not confirming. Everything goes to the banner
 * with one message.
 */
export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    setFormError(null);

    startTransition(async () => {
      const result = await LoginUser(values);

      if (!result.success) {
        setFormError(result.error ?? "Something went wrong. Try again.");
        return;
      }

      router.push("/");
      // Discards the client-side router cache so server components
      // re-render with the session that was just established.
      router.refresh();
    });
  });

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <Text size="sm" className="text-paper/70">
            Welcome back. Sign in to your command center.
          </Text>
        </header>

        <Panel plain>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              {formError && (
                <Alert
                  color="red"
                  icon={<IconAlertCircle size={16} />}
                  title="Couldn't sign you in"
                >
                  {formError}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="you@acmedental.com"
                autoComplete="email"
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                autoComplete="current-password"
                {...form.getInputProps("password")}
              />

              <Button
                type="submit"
                color="purple.4"
                size="lg"
                fullWidth
                mt="sm"
                loading={isPending}
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Panel>

        <Text className="mt-6 text-center text-paper/70" size="sm">
          Don&apos;t have an account?{" "}
          <Anchor
            component={Link}
            href="/auth/signup"
            size="sm"
            className="text-paper underline"
          >
            Sign up
          </Anchor>
        </Text>
      </div>
    </div>
  );
}