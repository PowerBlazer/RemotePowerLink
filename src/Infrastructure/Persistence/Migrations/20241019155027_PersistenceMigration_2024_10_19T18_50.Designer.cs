﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    [DbContext(typeof(PersistenceContext))]
    [Migration("20241019155027_PersistenceMigration_2024_10_19T18_50")]
    partial class PersistenceMigration_2024_10_19T18_50
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.Entities.Encoding", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<int>("CodePage")
                        .HasColumnType("integer")
                        .HasColumnName("code_page");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("pk_encodings");

                    b.HasIndex("CodePage")
                        .HasDatabaseName("ix_encodings_code_page");

                    b.HasIndex("Name")
                        .HasDatabaseName("ix_encodings_name");

                    b.ToTable("encodings", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            CodePage = 65001,
                            Name = "UTF-8"
                        },
                        new
                        {
                            Id = 2L,
                            CodePage = 1200,
                            Name = "UTF-16"
                        },
                        new
                        {
                            Id = 3L,
                            CodePage = 1201,
                            Name = "UTF-16BE"
                        },
                        new
                        {
                            Id = 4L,
                            CodePage = 12000,
                            Name = "UTF-32"
                        },
                        new
                        {
                            Id = 5L,
                            CodePage = 12001,
                            Name = "UTF-32BE"
                        },
                        new
                        {
                            Id = 6L,
                            CodePage = 1252,
                            Name = "Windows-1252"
                        },
                        new
                        {
                            Id = 7L,
                            CodePage = 1250,
                            Name = "Windows-1250"
                        },
                        new
                        {
                            Id = 8L,
                            CodePage = 1251,
                            Name = "Windows-1251"
                        },
                        new
                        {
                            Id = 9L,
                            CodePage = 1253,
                            Name = "Windows-1253"
                        },
                        new
                        {
                            Id = 10L,
                            CodePage = 1254,
                            Name = "Windows-1254"
                        },
                        new
                        {
                            Id = 11L,
                            CodePage = 1255,
                            Name = "Windows-1255"
                        },
                        new
                        {
                            Id = 12L,
                            CodePage = 1256,
                            Name = "Windows-1256"
                        },
                        new
                        {
                            Id = 13L,
                            CodePage = 1257,
                            Name = "Windows-1257"
                        },
                        new
                        {
                            Id = 14L,
                            CodePage = 1258,
                            Name = "Windows-1258"
                        },
                        new
                        {
                            Id = 15L,
                            CodePage = 28591,
                            Name = "ISO-8859-1"
                        },
                        new
                        {
                            Id = 16L,
                            CodePage = 28592,
                            Name = "ISO-8859-2"
                        },
                        new
                        {
                            Id = 17L,
                            CodePage = 28595,
                            Name = "ISO-8859-5"
                        },
                        new
                        {
                            Id = 18L,
                            CodePage = 28597,
                            Name = "ISO-8859-7"
                        },
                        new
                        {
                            Id = 19L,
                            CodePage = 28598,
                            Name = "ISO-8859-8"
                        },
                        new
                        {
                            Id = 20L,
                            CodePage = 28599,
                            Name = "ISO-8859-9"
                        },
                        new
                        {
                            Id = 21L,
                            CodePage = 20866,
                            Name = "KOI8-R"
                        },
                        new
                        {
                            Id = 22L,
                            CodePage = 21866,
                            Name = "KOI8-RU"
                        },
                        new
                        {
                            Id = 23L,
                            CodePage = 932,
                            Name = "Shift_JIS"
                        },
                        new
                        {
                            Id = 24L,
                            CodePage = 20932,
                            Name = "EUC-JP"
                        },
                        new
                        {
                            Id = 25L,
                            CodePage = 866,
                            Name = "CP866"
                        },
                        new
                        {
                            Id = 26L,
                            CodePage = 1254,
                            Name = "CP1254"
                        },
                        new
                        {
                            Id = 27L,
                            CodePage = 1255,
                            Name = "CP1255"
                        },
                        new
                        {
                            Id = 28L,
                            CodePage = 1256,
                            Name = "CP1256"
                        },
                        new
                        {
                            Id = 29L,
                            CodePage = 1257,
                            Name = "CP1257"
                        },
                        new
                        {
                            Id = 30L,
                            CodePage = 1258,
                            Name = "CP1258"
                        },
                        new
                        {
                            Id = 31L,
                            CodePage = 437,
                            Name = "CP437"
                        },
                        new
                        {
                            Id = 32L,
                            CodePage = 850,
                            Name = "CP850"
                        },
                        new
                        {
                            Id = 33L,
                            CodePage = 852,
                            Name = "CP852"
                        },
                        new
                        {
                            Id = 34L,
                            CodePage = 855,
                            Name = "CP855"
                        },
                        new
                        {
                            Id = 35L,
                            CodePage = 857,
                            Name = "CP857"
                        },
                        new
                        {
                            Id = 36L,
                            CodePage = 860,
                            Name = "CP860"
                        },
                        new
                        {
                            Id = 37L,
                            CodePage = 861,
                            Name = "CP861"
                        },
                        new
                        {
                            Id = 38L,
                            CodePage = 862,
                            Name = "CP862"
                        },
                        new
                        {
                            Id = 39L,
                            CodePage = 863,
                            Name = "CP863"
                        },
                        new
                        {
                            Id = 40L,
                            CodePage = 864,
                            Name = "CP864"
                        },
                        new
                        {
                            Id = 41L,
                            CodePage = 865,
                            Name = "CP865"
                        },
                        new
                        {
                            Id = 42L,
                            CodePage = 869,
                            Name = "CP869"
                        },
                        new
                        {
                            Id = 43L,
                            CodePage = 950,
                            Name = "Big5"
                        });
                });

            modelBuilder.Entity("Domain.Entities.Identity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date_created");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("title");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint")
                        .HasColumnName("user_id");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.HasKey("Id")
                        .HasName("pk_identities");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_identities_user_id");

                    b.HasIndex("UserId", "Title")
                        .HasDatabaseName("ix_identities_user_id_title");

                    b.ToTable("identities", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            DateCreated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Password = "123",
                            Title = "Test1",
                            UserId = 2L,
                            Username = "root"
                        },
                        new
                        {
                            Id = 2L,
                            DateCreated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Password = "123",
                            Title = "Test1",
                            UserId = 1L,
                            Username = "root"
                        });
                });

            modelBuilder.Entity("Domain.Entities.Proxy", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date_created");

                    b.Property<long>("IdentityId")
                        .HasColumnType("bigint")
                        .HasColumnName("identity_id");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("ip_address");

                    b.Property<int?>("SshPort")
                        .HasColumnType("integer")
                        .HasColumnName("ssh_port");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("title");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_proxies");

                    b.HasIndex("IdentityId")
                        .HasDatabaseName("ix_proxies_identity_id");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_proxies_user_id");

                    b.HasIndex("UserId", "Title")
                        .HasDatabaseName("ix_proxies_user_id_title");

                    b.ToTable("proxies", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            DateCreated = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IdentityId = 1L,
                            IpAddress = "123",
                            SshPort = 0,
                            Title = "Test1",
                            UserId = 2L
                        });
                });

            modelBuilder.Entity("Domain.Entities.Server", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date_created");

                    b.Property<long>("EncodingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasDefaultValue(1L)
                        .HasColumnName("encoding_id");

                    b.Property<long>("IdentityId")
                        .HasColumnType("bigint")
                        .HasColumnName("identity_id");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("ip_address");

                    b.Property<long?>("ProxyId")
                        .HasColumnType("bigint")
                        .HasColumnName("proxy_id");

                    b.Property<int?>("SshPort")
                        .HasColumnType("integer")
                        .HasColumnName("ssh_port");

                    b.Property<string>("StartupCommand")
                        .HasColumnType("text")
                        .HasColumnName("startup_command");

                    b.Property<long>("SystemTypeId")
                        .HasColumnType("bigint")
                        .HasColumnName("system_type_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("title");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_servers");

                    b.HasIndex("EncodingId")
                        .HasDatabaseName("ix_servers_encoding_id");

                    b.HasIndex("IdentityId")
                        .HasDatabaseName("ix_servers_identity_id");

                    b.HasIndex("ProxyId")
                        .HasDatabaseName("ix_servers_proxy_id");

                    b.HasIndex("SystemTypeId")
                        .HasDatabaseName("ix_servers_system_type_id");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_servers_user_id");

                    b.HasIndex("Title", "UserId")
                        .HasDatabaseName("ix_servers_title_user_id");

                    b.ToTable("servers", (string)null);
                });

            modelBuilder.Entity("Domain.Entities.Session", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date_created");

                    b.Property<string>("Path")
                        .HasColumnType("text")
                        .HasColumnName("path");

                    b.Property<long>("ServerId")
                        .HasColumnType("bigint")
                        .HasColumnName("server_id");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_sessions");

                    b.HasIndex("ServerId")
                        .HasDatabaseName("ix_sessions_server_id");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_sessions_user_id");

                    b.ToTable("sessions", (string)null);
                });

            modelBuilder.Entity("Domain.Entities.SystemType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("IconPath")
                        .HasColumnType("text")
                        .HasColumnName("icon_path");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("pk_system_types");

                    b.ToTable("system_types", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            Name = "Default"
                        },
                        new
                        {
                            Id = 2L,
                            IconPath = "/SystemTypes/windows.svg",
                            Name = "Windows"
                        },
                        new
                        {
                            Id = 3L,
                            IconPath = "/SystemTypes/arch-linux.svg",
                            Name = "ArchLinux"
                        },
                        new
                        {
                            Id = 4L,
                            IconPath = "/SystemTypes/opensuse.svg",
                            Name = "OpenSuse"
                        },
                        new
                        {
                            Id = 5L,
                            IconPath = "/SystemTypes/fedora.svg",
                            Name = "Fedora"
                        },
                        new
                        {
                            Id = 6L,
                            IconPath = "/SystemTypes/centos.svg",
                            Name = "CentOS"
                        },
                        new
                        {
                            Id = 7L,
                            IconPath = "/SystemTypes/debian.svg",
                            Name = "Debian"
                        },
                        new
                        {
                            Id = 8L,
                            IconPath = "/SystemTypes/macos.svg",
                            Name = "MacOS"
                        },
                        new
                        {
                            Id = 9L,
                            IconPath = "/SystemTypes/ubuntu.svg",
                            Name = "Ubuntu"
                        });
                });

            modelBuilder.Entity("Domain.Entities.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("UserId")
                        .HasColumnType("bigint")
                        .HasColumnName("user_id");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("username");

                    b.HasKey("Id")
                        .HasName("pk_users");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasDatabaseName("ix_users_user_id");

                    b.HasIndex("Username")
                        .HasDatabaseName("ix_users_username");

                    b.ToTable("users", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            UserId = 1L,
                            Username = "PowerBlaze"
                        },
                        new
                        {
                            Id = 2L,
                            UserId = 2L,
                            Username = "PowerBlaze"
                        });
                });

            modelBuilder.Entity("Domain.Entities.Identity", b =>
                {
                    b.HasOne("Domain.Entities.User", "User")
                        .WithMany("Identities")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_identities_users_user_id");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Domain.Entities.Proxy", b =>
                {
                    b.HasOne("Domain.Entities.Identity", "Identity")
                        .WithMany("Proxies")
                        .HasForeignKey("IdentityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_proxies_identities_identity_id");

                    b.HasOne("Domain.Entities.User", "User")
                        .WithMany("Proxies")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_proxies_users_user_id");

                    b.Navigation("Identity");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Domain.Entities.Server", b =>
                {
                    b.HasOne("Domain.Entities.Encoding", "Encoding")
                        .WithMany("Servers")
                        .HasForeignKey("EncodingId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired()
                        .HasConstraintName("fk_servers_encodings_encoding_id");

                    b.HasOne("Domain.Entities.Identity", "Identity")
                        .WithMany("Servers")
                        .HasForeignKey("IdentityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_servers_identities_identity_id");

                    b.HasOne("Domain.Entities.Proxy", "Proxy")
                        .WithMany("Servers")
                        .HasForeignKey("ProxyId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .HasConstraintName("fk_servers_proxies_proxy_id");

                    b.HasOne("Domain.Entities.SystemType", "SystemType")
                        .WithMany("Servers")
                        .HasForeignKey("SystemTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_servers_system_types_system_type_id");

                    b.HasOne("Domain.Entities.User", "User")
                        .WithMany("Servers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_servers_users_user_id");

                    b.Navigation("Encoding");

                    b.Navigation("Identity");

                    b.Navigation("Proxy");

                    b.Navigation("SystemType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Domain.Entities.Session", b =>
                {
                    b.HasOne("Domain.Entities.Server", "Server")
                        .WithMany("Sessions")
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_sessions_servers_server_id");

                    b.HasOne("Domain.Entities.User", "User")
                        .WithMany("Sessions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_sessions_users_user_id");

                    b.Navigation("Server");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Domain.Entities.Encoding", b =>
                {
                    b.Navigation("Servers");
                });

            modelBuilder.Entity("Domain.Entities.Identity", b =>
                {
                    b.Navigation("Proxies");

                    b.Navigation("Servers");
                });

            modelBuilder.Entity("Domain.Entities.Proxy", b =>
                {
                    b.Navigation("Servers");
                });

            modelBuilder.Entity("Domain.Entities.Server", b =>
                {
                    b.Navigation("Sessions");
                });

            modelBuilder.Entity("Domain.Entities.SystemType", b =>
                {
                    b.Navigation("Servers");
                });

            modelBuilder.Entity("Domain.Entities.User", b =>
                {
                    b.Navigation("Identities");

                    b.Navigation("Proxies");

                    b.Navigation("Servers");

                    b.Navigation("Sessions");
                });
#pragma warning restore 612, 618
        }
    }
}