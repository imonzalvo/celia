import tw from "twin.macro";
import CustomInput from "components/input";

const Form = tw.form`flex flex-col items-start w-full`;
const Separator = tw.div`tablet:w-0 w-8 mt-4`;
const InputContainer = tw.div`flex w-full mt-4 tablet:flex-col`;
const SubmitButton = tw.button`mt-8 cursor-pointer w-full text-sm font-bold tracking-wider bg-transparent hover:bg-black text-black font-semibold 
                              hover:text-white py-4 px-12 border-2 border-black hover:border-transparent 
                              tablet:fixed tablet:bottom-0 tablet:left-0 tablet:bg-black tablet:text-white`;

export default ({ handleSubmit, register, errors, onSubmit }) => {
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputContainer>
        <CustomInput
          label="Nombre"
          placeholder="Juan"
          register={register}
          inputOptions={{
            required: true,
          }}
          name="name"
          errors={errors.name}
        />
        <Separator style={{ width: 32 }}></Separator>
        <CustomInput
          label="Apellido"
          register={register}
          inputOptions={{
            required: true,
          }}
          name="lastName"
          errors={errors.lastName}
        />
      </InputContainer>
      <InputContainer>
        <CustomInput
          label="Telefono"
          placeholder="094123123"
          register={register}
          inputOptions={{
            required: true,
            pattern: /09[0-9]{7}/,
          }}
          name="phone"
          errors={errors.phone}
        />
      </InputContainer>
      <InputContainer>
        <CustomInput
          label={"Email"}
          placeholder="email@example.com"
          inputOptions={{
            required: true,
            pattern:
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          }}
          register={register}
          name="email"
          errors={errors.email}
        />
      </InputContainer>
      <InputContainer>
        <CustomInput
          label="Dirección"
          placeholder="Calle, Nº de puerta, apto, etc"
          register={register}
          inputOptions={{
            required: true,
          }}
          name="address"
          errors={errors.address}
        />
      </InputContainer>
      <InputContainer>
        <CustomInput
          label="Departamento"
          placeholder="Montevideo"
          register={register}
          inputOptions={{
            required: true,
          }}
          name="city"
          errors={errors.city}
        />
      </InputContainer>
      <InputContainer>
        <CustomInput
          label="Código Postal"
          placeholder="11000"
          register={register}
          inputOptions={{
            required: true,
          }}
          name="postalCode"
          errors={errors.postalCode}
        />
      </InputContainer>
      <SubmitButton onClick={handleSubmit} type="submit">
        Realizar Pedido
      </SubmitButton>
    </Form>
  );
};
