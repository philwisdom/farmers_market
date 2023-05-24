--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bins; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.bins (
    id integer NOT NULL,
    location_id integer,
    vendor_id integer,
    product_id integer,
    quantity integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.bins OWNER TO me;

--
-- Name: Bins_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.bins ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Bins_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: locations; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    "row" integer,
    shelf integer,
    created_at timestamp with time zone
);


ALTER TABLE public.locations OWNER TO me;

--
-- Name: Locations_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.locations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Locations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text,
    price double precision,
    is_fruit boolean,
    is_vegetable boolean,
    is_meat boolean,
    is_fish boolean,
    is_organic boolean DEFAULT true
);


ALTER TABLE public.products OWNER TO me;

--
-- Name: Products_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vendors; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name text,
    phone integer,
    email text
);


ALTER TABLE public.vendors OWNER TO me;

--
-- Name: Vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.vendors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Vendors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: employees; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name text NOT NULL,
    is_manager boolean NOT NULL,
    vendor_id integer NOT NULL,
    phone integer
);


ALTER TABLE public.employees OWNER TO me;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.employees ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.employees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sales; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.sales (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.sales OWNER TO me;

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.sales ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sales_items; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.sales_items (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sales_items OWNER TO me;

--
-- Name: sales_items_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

ALTER TABLE public.sales_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sales_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bins Bins_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT "Bins_pkey" PRIMARY KEY (id);


--
-- Name: locations Locations_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT "Locations_pkey" PRIMARY KEY (id);


--
-- Name: products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: vendors Vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "Vendors_pkey" PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: sales_items sales_items_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

